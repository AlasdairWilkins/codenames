module.exports = {

    drop: {
        namespace: `DROP TABLE IF EXISTS namespaces;`,
        session: `DROP TABLE IF EXISTS sessions;`,
        message: `DROP TABLE IF EXISTS chats;`
    },

    create: {
        namespace: `CREATE TABLE IF NOT EXISTS namespaces (
                nsp_id TEXT PRIMARY KEY
                );`,
        session: `CREATE TABLE IF NOT EXISTS sessions (
                session_id   TEXT PRIMARY KEY,
                nsp_id   TEXT,
                display_name    TEXT,
                socket_id   TEXT,
                ready   BOOLEAN DEFAULT 0 CHECK (ready in (0,1)),
                team    TEXT    DEFAULT NULL    CHECK (team in (NULL, 'blue', 'red')),
                    FOREIGN KEY (nsp_id) REFERENCES namespaces(nsp_id)
                );`,
        message: `CREATE TABLE IF NOT EXISTS chats (
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
    },

    insert: {
        namespace: `INSERT INTO namespaces(nsp_id) VALUES (?)`,
        session: `INSERT INTO sessions(session_id, nsp_id) VALUES (?, ?);`,
        message: `INSERT INTO chats(nsp_id, message, socket_id, session_id, display_name) 
                    SELECT (?), (?), (?), session_id, display_name FROM sessions WHERE socket_id = (?);`
    },

    update: {
        socketID: `UPDATE sessions SET socket_id = ? WHERE session_id = ?`,
        displayName: `UPDATE sessions SET display_name = ?, socket_id = ? WHERE session_id = ?`,
        ready: `UPDATE sessions SET ready = 1 WHERE socket_id = ?`,
        team: `UPDATE sessions SET team = (?) WHERE socket_id = (?)`,
        disconnect: `UPDATE sessions SET socket_id = ? WHERE socket_id = ?`
    },

    get: {
        joining: `SELECT count(*) count FROM sessions WHERE nsp_id = (?) AND display_name IS NULL`,
        ready: `SELECT COUNT(*) count FROM sessions WHERE nsp_id = (?) AND ready = 0`,
        namespace: `SELECT nsp_id nspID FROM namespaces WHERE nsp_id = ?`,
        resume: `SELECT nsp_id nspID, display_name displayName FROM sessions WHERE session_id = ?`
    },

    all: {
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
    }
}