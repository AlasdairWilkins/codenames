const dao = require('../dao');
const shortid = require('shortid');

const createGame = function(nspID, callback) {
    let gameID = shortid.generate();
    dao.query('games', 'insert', gameID, nspID, () => {
        dao.query('players', 'insert', gameID, nspID, () => {
            dao.query('namespaces', 'update', 'select', nspID, () => {
                callback()
            })
        })
    })
};

const updateCodeword = function(codeword, nspID, callback) {
    dao.query('games', 'update', 'codeword', codeword, nspID, () => {
        callback()
    })
};

const getCodeword = function(callback) {
    dao.query('games', 'get', 'codeword', nspID, codeword => {
        callback(codeword)
    })
};

module.exports = {createGame, updateCodeword, getCodeword};