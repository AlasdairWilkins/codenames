const sessions = {
    drop: `DROP TABLE IF EXISTS sessions;`,
    create: `CREATE TABLE IF NOT EXISTS sessions (
                session_id   TEXT PRIMARY KEY,
                nsp_id   TEXT,
                display_name    TEXT,
                socket_id   TEXT,
                ready   BOOLEAN DEFAULT 0 CHECK (ready in (0,1)),
                    FOREIGN KEY (nsp_id) REFERENCES namespaces(nsp_id)
                );`,
    insert: `INSERT INTO sessions(session_id, nsp_id) VALUES (?, ?);`,
    update: {
        socketID: `UPDATE sessions SET socket_id = ? WHERE session_id = ?`,
        displayName: `UPDATE sessions SET display_name = ?, socket_id = ? WHERE session_id = ?`,
        waitingReady: `UPDATE sessions SET ready = 1 WHERE socket_id = ?`,
        disconnect: `UPDATE sessions SET socket_id = null WHERE socket_id = ?`,
        resetReady: `UPDATE sessions SET ready = 0 WHERE nsp_id = ?`,
    },
    get: {
        joining: `SELECT count(*) count FROM sessions WHERE nsp_id = (?) AND display_name IS NULL`,
        waitingReady: `SELECT count(*) count FROM sessions WHERE nsp_id = (?) AND ready = 0`,
        resume: `SELECT nsp_id nspID, display_name displayName FROM sessions WHERE session_id = ?`,
    },
    all: `SELECT display_name name,
                    socket_id socketID,
                    session_id sessionID
            FROM sessions
            WHERE nsp_id = ? AND display_name IS NOT NULL
            ORDER BY display_name;`
}

module.exports = sessions