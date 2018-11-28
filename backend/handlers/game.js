const dao = require('../dao');

const {getWords} = require('./words')


const getGameInfo = function(clientID, nspID) {
    return Promise.all(
        [getWords(clientID, nspID), getTeam(clientID, nspID), getCodemaster(clientID, nspID)])
        .then(([words, team, codemaster]) => {
            return Promise.resolve({words, team, codemaster})
        })
        .catch(err => {
            return Promise.reject(err)
        })
};

const getTeam = function(clientID, nspID) {
    return new Promise((resolve, reject) => {
        dao.query('players', 'get', 'team', clientID, nspID)
            .then(result => {
                resolve(result)
            })
            .catch(err => {
                reject(err)
            })
    })
};

const getCodemaster = function(clientID, nspID) {
    return new Promise((resolve, reject) => {
        dao.query('players', 'get', 'codemaster', clientID, nspID)
            .then(result => {
                resolve(!!result)
            })
            .catch(err => {
                reject(err)
            })
    })

};

const updateCodeword = function(codeword, nspID, callback) {
    dao.query('games', 'update', 'codeword', codeword, nspID, (err) => {
        callback()
    })
};

const getCodeword = function(nspID, callback) {
    dao.query('games', 'get', 'codeword', nspID, (err, codeword) => {
        callback(codeword)
    })
};

module.exports = {updateCodeword, getCodeword, getGameInfo};