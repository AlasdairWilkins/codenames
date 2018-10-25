const sqlite3 = require('sqlite3').verbose()
const Promise = require('bluebird')
const shortid = require('shortid')

const db = new sqlite3.Database('./test.db', err => {
    if (err) {
        console.error(err.message)
    } else {
        console.log("Connected to the test database.")
    }
})

let sql =
    `CREATE TABLE IF NOT EXISTS users (
        user_id   TEXT PRIMARY KEY,
        namespace   TEXT
    );`

db.run(sql)

let sql2 =
    `INSERT INTO users(user_id, namespace) VALUES(?, ?)`

let data = [shortid.generate(), shortid.generate()]

db.run(sql2, data, function(err) {
    if (err) {
        console.error(err.message)
    } else {
        console.log(this.changes)
    }
})

db.close()