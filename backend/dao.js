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

            let deleteChatSQL =
                `DROP TABLE IF EXISTS chats;`

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
                ready   BOOLEAN DEFAULT 0 CHECK (ready in (0,1)),
                team    TEXT    DEFAULT NULL    CHECK (team in (NULL, 'blue', 'red')),
                    FOREIGN KEY (nsp_id) REFERENCES namespaces(nsp_id)
            );`

            let chatsSQL =
                `CREATE TABLE IF NOT EXISTS chats (
                chat_id INTEGER PRIMARY KEY,
                nsp_id  text    NOT NULL,
                session_id  text,
                display_name text,
                socket_id text,
                message text    NOT NULL,
                    FOREIGN KEY (nsp_id) REFERENCES namespaces(nsp_id),
                    FOREIGN KEY (session_id) REFERENCES sessions(session_id),
                    FOREIGN KEY (display_name) REFERENCES sessions(display_name),
                    FOREIGN KEY (socket_id) REFERENCES sessions(socket_id) ON UPDATE CASCADE
                );`

            this.db.run(deleteNspSQL)
            this.db.run(deleteSessSQL)
            this.db.run(deleteChatSQL)
            this.db.run(namespacesSQL)
            this.db.run(sessionsSQL)
            this.db.run(chatsSQL)

        })





    }

    insert(sql, params, cb) {
        this.db.run(sql, params, function (err) {
            if (err) {
                console.error("Insert error:", sql, params, err.message)
            } else {
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