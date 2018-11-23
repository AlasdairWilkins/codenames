const dao = require('../dao');
const shortid = require('shortid');

const createSession = function(clientID, nspID) {
    return new Promise((resolve, reject) => {
        let sessionID = shortid.generate();
        console.log(sessionID)
        dao.query('sessions', 'insert', sessionID, clientID, nspID)
            .then(() => {
                return dao.query('sessions', 'get', 'session', clientID, nspID)
            })
            .then(row => {
                resolve(row)
            })
            .catch(err => {
                reject(err)
            })
    })
};

const newDisplayName = function(nameMSG, clientID, nspID) {
    return Promise.all([setDisplayName(nameMSG, clientID, nspID), getAllSessions(nspID), getJoining(nspID)])
        .then(([name, players, joining]) => {
            console.log(name, players, joining)
            return {name, players, joining}
        })
        .catch(err => {
            console.error(err.message)
        })
}

const setDisplayName = function(name, clientID, nspID) {
    return new Promise((resolve, reject) => {
        dao.query('sessions', 'update', 'displayName', name, clientID, nspID)
            .then(() => {
                return getDisplayName(clientID, nspID)
            })
            .then(name => {
                resolve(name)
            })
            .catch(err => {
                reject(err)
            })
    })
};

const getDisplayName = function(clientID, nspID) {
    return new Promise((resolve, reject) => {
        dao.query('sessions', 'get', 'displayName', clientID, nspID)
            .then(function(result) {
                resolve(result)
            })
            .catch(function(err) {
                reject(err)
            })
    })

};

const getAllSessions = function(nspID) {
    return new Promise((resolve, reject) => {
        dao.query('sessions', 'all', nspID)
            .then(function(rows) {
                resolve(rows)
            })
            .catch(function(err) {
                reject(err)
            })
    })
};

const getJoining = function(nspID) {
    return new Promise((resolve, reject) => {
        dao.query('sessions', 'get', 'joining', nspID)
            .then(joining => {
                resolve(joining)
            })
            .catch(function(err) {
                reject(err)
            })
    })
}

const removeSocketIDOnDisconnect = function(clientID) {
    dao.query('sessions', 'update', 'disconnect', clientID, (err) => {

    })
};

module.exports =
    {createSession, newDisplayName, getJoining, getAllSessions, removeSocketIDOnDisconnect};