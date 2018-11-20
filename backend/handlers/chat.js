const dao = require('../dao');

const addChat = function(nspID, entry, displayName, socketID, callback) {
    dao.query('chats', 'insert', nspID, entry, displayName, socketID, socketID, () => {
        callback()
    })
};

const getChat = function() {

};

const getAllChats = function(nspID, callback) {
    dao.query('chats', 'all', nspID, rows => {
        callback(rows)
    })
};

module.exports = {addChat, getChat, getAllChats};