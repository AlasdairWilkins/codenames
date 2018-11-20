const dao = require('../dao');
const shortid = require('shortid');

const createSession = function(nspID, callback) {
    let sessionID = shortid.generate();
    dao.query('sessions', 'insert', sessionID, nspID, () => {
        dao.query('sessions', 'get', 'session', sessionID, nspID, (row) => {
            if (row) {
                callback(row.sessionID)
            } else {
                console.log("No session!")
            }
        })
    });
};

const setDisplayName = function(name, clientID, cookie, nspID, callback) {
    dao.query('sessions', 'update', 'displayName', name, clientID, cookie, () => {
        dao.query('sessions', 'all', nspID, rows => {
            dao.query('sessions', 'get', 'joining', nspID, row => {
                callback(rows, row.count)
            })
        })
    })
};

const getDisplayName = function(cookie, nspID, callback) {
    dao.query('sessions', 'get', 'displayName', cookie, nspID, result => {
        callback(result.name)
    })
};

const getAllSessions = function(nspID, callback) {
    dao.query('sessions', 'all', nspID, rows => {
        dao.query('sessions', 'get', 'joining', nspID, row => {
            callback(rows, row.count)
        })
    })
};

const removeSocketIDOnDisconnect = function(clientID) {
    dao.query('sessions', update, disconnect, clientID)
};

module.exports = {createSession, setDisplayName, getDisplayName, getAllSessions, removeSocketIDOnDisconnect};