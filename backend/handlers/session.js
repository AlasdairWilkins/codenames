const dao = require('../dao');
const shortid = require('shortid');

const createSession = function(nspID, callback) {
    let sessionID = shortid.generate();
    dao.query('sessions', 'insert', sessionID, nspID, (err) => {
        dao.query('sessions', 'get', 'session', sessionID, nspID, (err, row) => {
            if (row) {
                console.log(row, row.sessionID)
                callback(row.sessionID)
            } else {
                console.log("No session!")
            }
        })
    });
};

const setDisplayName = function(name, clientID, cookie, nspID, callback) {
    dao.query('sessions', 'update', 'displayName', name, clientID, cookie, (err) => {
        dao.query('sessions', 'all', nspID, (err, rows) => {
            dao.query('sessions', 'get', 'joining', nspID, (err, row) => {
                callback(rows, row.count)
            })
        })
    })
};

const getDisplayName = function(cookie, nspID, callback) {
    dao.query('sessions', 'get', 'displayName', cookie, nspID, (err, result) => {
        callback(result.name)
    })
};

const getAllSessions = function(nspID, callback) {
    dao.query('sessions', 'all', nspID, (err, rows) => {
        dao.query('sessions', 'get', 'joining', nspID, (err, row) => {
            callback(rows, row.count)
        })
    })
};

const removeSocketIDOnDisconnect = function(clientID) {
    dao.query('sessions', 'update', 'disconnect', clientID, (err) => {

    })
};

module.exports = {createSession, setDisplayName, getDisplayName, getAllSessions, removeSocketIDOnDisconnect};