const sqlite3 = require('sqlite3').verbose()

const dbFilePath = './db/sqlite.db'

// const tables = {
//     sessions: `sessions(session_id, nsp_id)`,
//     namespaces: `namespaces(nsp_id)`
// }

class DAO {
    constructor(dbFilePath) {
        this.db = new sqlite3.Database(dbFilePath, err => {
            if (err) {
                console.error(err.message)
            } else {
                console.log("Connected to the database.")
            }
        })

        this.db.serialize(() => {
            let deleteNspSQL =
                `DROP TABLE IF EXISTS namespaces;`

            let deleteSessSQL =
                `DROP TABLE IF EXISTS sessions;`

            let namespacesSQL =
                `CREATE TABLE IF NOT EXISTS namespaces (
                nsp_id TEXT PRIMARY KEY
             );`

            let sessionsSQL =
                `CREATE TABLE IF NOT EXISTS sessions (
                session_id   TEXT PRIMARY KEY,
                nsp_id   TEXT,
                display_name    TEXT,
                socket_id   TEXT,
                    FOREIGN KEY (nsp_id) REFERENCES namespaces(nsp_id)
            );`

            this.db.run(deleteNspSQL)
            this.db.run(deleteSessSQL)
            this.db.run(namespacesSQL)
            this.db.run(sessionsSQL)
        })





    }

    insert(sql, params, cb) {
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
            } else {
                cb(row)
            }
        })
    }
}

module.exports = new DAO(dbFilePath)