const dao = require('../dao');
const {get, insert, update} = require('../constants');

const guess = function(word, nspID, callback) {
    dao.query('guesses', insert, word, word, nspID, nspID, (err) => {
        dao.query('games', update, 'guessEntered', nspID, (err) => {
            dao.query('words', update, nspID, word, nspID, (err) => {
                dao.query('guesses', get, nspID, nspID, (err, result) => {
                    callback(result)
                })
            })
        })
    })
};

module.exports = {guess};