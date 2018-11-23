const dao = require('../dao');

const addChat = function(nspID, entry, name, socketID) {
    return new Promise((resolve, reject) => {
        dao.query('chats', 'insert', nspID, entry, name, socketID, socketID)
            .then(() => {
                resolve({entry, name, socketID})
            })
            .catch(err => {
                reject(err)
            })
    })
};

const getChat = function() {

};

const getAllChats = function(nspID, callback) {
    return new Promise((resolve, reject) => {
        dao.query('chats', 'all', nspID)
            .then(rows => {
                resolve(rows)
            })
            .catch(err => {
                reject(err)
            })
    })
};

module.exports = {addChat, getChat, getAllChats};