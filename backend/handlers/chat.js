const dao = require('../dao');

const addChat = function(nspID, entry, name, socketID) {
    return new Promise((resolve, reject) => {
        dao.query('chats', 'insert', nspID, entry, name, socketID, socketID)
            .then((res) => {
                return getChat(res.lastID)
            })
            .then(message => {
                resolve(message)
            })
            .catch(err => {
                reject(err)
            })
    })
};

const getChat = function(lastID) {
    return new Promise((resolve, reject) => {
        dao.query('chats', 'get', lastID)
            .then(message => {
                resolve(message)
            })
            .catch(err => {
                reject(err)
            })
    })
};

const getAllChats = function(nspID, callback) {
    return new Promise((resolve, reject) => {
        dao.query('chats', 'all', nspID)
            .then(rows => {
                console.log(rows)
                resolve(rows)
            })
            .catch(err => {
                reject(err)
            })
    })
};

module.exports = {addChat, getAllChats};