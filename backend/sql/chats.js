const {create, int, text, foreign} = require('./templates');

const chats = {
    create: create('chats', int('chat_id').primary(), text('nsp_id').notNull(), text('session_id'),
        text('display_name'), text('socket_id'), text('message').notNull(), foreign('nsp_id', 'namespaces'),
        foreign('session_id', 'sessions'), foreign('display_name', 'sessions'),
        foreign('socket_id', 'sessions').onUpdateCascade()),

    insert: `INSERT INTO chats(nsp_id, message, display_name, socket_id, session_id) 
                    SELECT (?), (?), (?), (?), session_id FROM sessions WHERE socket_id = (?);`,
    all: `SELECT message entry,
                        socket_id socketID,
                        display_name name
                        FROM chats
                        WHERE nsp_id = ?;`,
};

module.exports = chats;