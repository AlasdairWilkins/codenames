const dao = require('../dao');
const shortid = require('shortid');


const setWaitingReady = function(clientID, nspID) {
    return new Promise((resolve, reject) => {
        setReady('sessions', clientID, nspID)
            .then(count => {
                if (!count) {
                    return createGame(nspID)
                } else {
                    return false
                }
            })
            .then(result => {
                resolve(result)
            })
            .catch(err => {
                reject(err)
            })
    })
}

const createGame = function(nspID) {
    let gameID = shortid.generate()
    return Promise.all([dao.query('games', 'insert', gameID, nspID),
        dao.query('players', 'insert', gameID, nspID), dao.query('namespaces', 'update', 'select', nspID)])
        .then((result) => {
            return true
        })
        .catch(err => {
            console.error(err.message)
        })
};

const setReady = function(header, clientID, nspID) {
    return new Promise((resolve, reject) => {
        dao.query(header, 'update', 'ready', clientID)
            .then(() => {
                return checkAllReady(header, nspID)
            })
            .then(count => {
                resolve(count)
            })
            .catch(err => {
                reject(err)
            })
    })

};

const checkAllReady = function(header, nspID) {
    return new Promise((resolve, reject) => {
        dao.query(header, 'get', 'ready', nspID)
            .then(count => {
                resolve(count)
            })
            .catch(err => {
                reject(err)
            })
    })
};

module.exports = {setWaitingReady};