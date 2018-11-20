const dao = require('../dao');

const getTurnAndRemainingWords = function(nspID, callback) {
    dao.query('games', 'get', 'turn', nspID, (err, turn) => {
        dao.query('words', 'get', 'remaining', turn, nspID, (err, remaining) => {
            callback(turn, remaining)
        })
    })
};

module.exports = {getTurnAndRemainingWords};