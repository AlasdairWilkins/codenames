const chats = {
    drop: `DROP TABLE IF EXISTS chats;`,
    create: `CREATE TABLE IF NOT EXISTS chats (
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
                );`,
    insert: `INSERT INTO chats(nsp_id, message, display_name, socket_id, session_id) 
                    SELECT (?), (?), (?), (?), session_id FROM sessions WHERE socket_id = (?);`,
    all: `SELECT message entry,
                        socket_id socketID,
                        display_name name
                        FROM chats
                        WHERE nsp_id = ?;`,
}

module.exports = chats