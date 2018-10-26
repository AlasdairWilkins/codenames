const sqlite3 = require('sqlite3').verbose()

const dbFilePath = './db/sqlite.db'

const tables = {
    sessions: `sessions(session_id, namespace)`
}

class DAO {
    constructor(dbFilePath) {
        this.db = new sqlite3.Database(dbFilePath, err => {
            if (err) {
                console.error(err.message)
            } else {
                console.log("Connected to the database.")
            }
        })

        let sql =
            `CREATE TABLE IF NOT EXISTS sessions (
                session_id   TEXT PRIMARY KEY,
                namespace   TEXT
            );`

        this.db.run(sql)

    }

    insert(header, params, cb) {
        let sql = `INSERT INTO ${tables[header]} VALUES(?, ?);`

        this.db.run(sql, params, function (err) {
            if (err) {
                console.error("Insert error:", err.message)
            } else {
                console.log("Success!")
                cb()
            }
        })
    }
}

module.exports = new DAO(dbFilePath)