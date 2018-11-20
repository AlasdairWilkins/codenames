const dao = require('../dao');
const {get, insert, update} = require('../constants');

const guess = function(word, nspID, callback) {
    dao.query('guesses', insert, word, word, nspID, nspID, () => {
        dao.query('games', update, 'guessEntered', nspID, () => {
            dao.query('words', update, nspID, word, nspID, () => {
                dao.query('guesses', get, nspID, nspID, (result) => {
                    callback(result)
                })
            })
        })
    })
};

module.exports = {guess};