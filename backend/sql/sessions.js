const {create, text, bool, foreign} = require('./templates')

const sessions = {
    create: create('sessions', text('session_id').primary(), text('nsp_id'), text('display_name'),
        text('socket_id'), bool('ready', 0), foreign('nsp_id', 'namespaces')),

    insert: `INSERT INTO sessions(session_id, nsp_id) VALUES (?, ?);`,
    update: {
        socketID: `UPDATE sessions SET socket_id = ? WHERE session_id = ?`,
        displayName: `UPDATE sessions SET display_name = ?, socket_id = ? WHERE session_id = ?`,
        waitingReady: `UPDATE sessions SET ready = 1 WHERE socket_id = ?`,
        disconnect: `UPDATE sessions SET socket_id = null WHERE socket_id = ?`,
        resetReady: `UPDATE sessions SET ready = 0 WHERE nsp_id = ?`,
    },
    get: {
        session: `SELECT session_id sessionID FROM sessions WHERE session_id = (?) AND nsp_id = (?)`,
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