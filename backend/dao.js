const sqlite3 = require('sqlite3').verbose();

const dbFilePath = './db/sqlite.db';

class DAO {
    constructor(dbFilePath) {

        this.inserts = {
            namespace: `INSERT INTO namespaces(nsp_id) VALUES (?)`,
            session: `INSERT INTO sessions(session_id, nsp_id) VALUES (?, ?);`,
            message: `INSERT INTO chats(nsp_id, message, socket_id, session_id, display_name) 
                    SELECT (?), (?), (?), session_id, display_name FROM sessions WHERE socket_id = (?);`
        };

        this.updates = {
            socketID: `UPDATE sessions SET socket_id = ? WHERE session_id = ?`,
            displayName: `UPDATE sessions SET display_name = ?, socket_id = ? WHERE session_id = ?`,
            ready: `UPDATE sessions SET ready = 1 WHERE socket_id = ?`,
            team: `UPDATE sessions SET team = (?) WHERE socket_id = (?)`,
            disconnect: `UPDATE sessions SET socket_id = ? WHERE socket_id = ?`
        };

        this.gets = {
            joining: `SELECT count(*) count FROM sessions WHERE nsp_id = (?) AND display_name IS NULL`,
            ready: `SELECT COUNT(*) count FROM sessions WHERE nsp_id = (?) AND ready = 0`,
            namespace: `SELECT nsp_id nspID FROM namespaces WHERE nsp_id = ?`,
            resume: `SELECT nsp_id nspID, display_name displayName FROM sessions WHERE session_id = ?`
        };

        this.alls = {
            player: `SELECT display_name name,
                        socket_id socketID,
                        session_id sessionID
                FROM sessions
                WHERE nsp_id = ? AND display_name IS NOT NULL
                ORDER BY display_name;`,
            message: `SELECT message entry,
                        socket_id socketID,
                        display_name name
                        FROM chats
                        WHERE nsp_id = ?;`,
            team: `SELECT display_name name,
                        socket_id socketID,
                        team
                    FROM sessions
                    WHERE nsp_id = ?
                    ORDER BY display_name;`,
        };

        this.db = new sqlite3.Database(dbFilePath, err => {
            if (err) {
                console.error(err.message)
            } else {
                console.log("Connected to the database.")
            }
        });

        this.db.serialize(() => {
            let deleteNspSQL =
                `DROP TABLE IF EXISTS namespaces;`;

            let deleteSessSQL =
                `DROP TABLE IF EXISTS sessions;`;

            let deleteChatSQL =
                `DROP TABLE IF EXISTS chats;`;

            let namespacesSQL =
                `CREATE TABLE IF NOT EXISTS namespaces (
                nsp_id TEXT PRIMARY KEY
             );`;


            let sessionsSQL =
                `CREATE TABLE IF NOT EXISTS sessions (
                session_id   TEXT PRIMARY KEY,
                nsp_id   TEXT,
                display_name    TEXT,
                socket_id   TEXT,
                ready   BOOLEAN DEFAULT 0 CHECK (ready in (0,1)),
                team    TEXT    DEFAULT NULL    CHECK (team in (NULL, 'blue', 'red')),
                    FOREIGN KEY (nsp_id) REFERENCES namespaces(nsp_id)
            );`;

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
                );`;

            this.db.run(deleteNspSQL);
            this.db.run(deleteSessSQL);
            this.db.run(deleteChatSQL);
            this.db.run(namespacesSQL);
            this.db.run(sessionsSQL);
            this.db.run(chatsSQL)

        })

    }

    query() {
        let type = arguments[0];
        let header = arguments[1];
        let hasCB = (typeof arguments[arguments.length - 1] === "function");
        let params = [];
        for (let i = 2; (hasCB) ? i < arguments.length - 1 : i < arguments.length; i++) {
            params.push(arguments[i])
        }
        let cb = (hasCB) ? arguments[arguments.length - 1] : null;

        this[type](header, params, cb)

    }

    insert(header, params, cb) {

        this.db.run(this.inserts[header], params, function (err) {
            if (err) {
                console.error("Insert error:", err.message)
            } else {
                cb()
            }
        })
    }

    update(header, params, cb) {

        this.db.run(this.updates[header], params, function(err) {
            if (err) {
                console.error("Update error", err.message)
            } else {
                if (cb) {
                    cb()
                }
            }
        })
    }

    get(header, params, cb) {

        this.db.get(this.gets[header], params, function(err, row) {
            if (err) {
                console.error("Get error:", err.message)
            } else {
                cb(row)
            }
        })
    }

    all(header, params, cb) {

        this.db.all(this.alls[header], params, function(err, rows) {
            if (err) {
                console.error("All error:", err.message)
            } else {
                cb(rows)
            }
        })
    }
}

module.exports = new DAO(dbFilePath);