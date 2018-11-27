const dao = require('../dao');

const getGameInfo = function() {

}

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

module.exports = {updateCodeword, getCodeword};