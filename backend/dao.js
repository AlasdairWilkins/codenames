const sqlite3 = require('sqlite3').verbose()

const dbFilePath = './db/sqlite.db'

const tables = {
    sessions: `sessions(session_id, nsp_id)`
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
                nsp_id   TEXT,
                display_name    TEXT,
                socket_id   TEXT
            );`

        this.db.run(sql)

    }

    insert(header, params, cb) {
        let sql = `INSERT INTO ${tables[header]} VALUES(?, ?);`

        this.db.run(sql, params, function (err) {
            if (err) {
                console.error("Insert error:", sql, params, err.message)
            } else {
                console.log("Success!")
                cb()
            }
        })
    }

    update(sql, params, cb) {
        this.db.run(sql, params, function(err) {
            if (err) {
                console.error("Update error", sql, params, err.message)
            } else {
                console.log("Updated!")
                if (cb) {
                    cb()
                }

            }
        })
    }

    get(sql, params, cb) {
        this.db.get(sql, params, function(err, row) {
            if (err) {
                console.log("Get error:", sql, params, err.message)
            } else if (row) {
                cb(row)
            }
        })
    }
}

module.exports = new DAO(dbFilePath)