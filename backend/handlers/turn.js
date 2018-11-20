const dao = require('../dao');

const getTurnAndRemainingWords = function(nspID, callback) {
    dao.query('games', 'get', 'turn', nspID, turn => {
        dao.query('words', 'get', 'remaining', turn, nspID, remaining => {
            callback(turn, remaining)
        })
    })
};

module.exports = {getTurnAndRemainingWords};