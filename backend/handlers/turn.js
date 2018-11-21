const dao = require('../dao');

const getTurnAndRemainingWords = function(nspID, callback) {
    dao.query('games', 'get', 'turn', nspID, (err, gameResult) => {
        dao.query('words', 'get', 'remaining', gameResult.turn, nspID, (err, wordsResult) => {
            callback(gameResult.team, wordsResult.remaining)
        })
    })
};

module.exports = {getTurnAndRemainingWords};