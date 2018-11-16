const dao = require('./dao');
const {get, insert, update} = require('./constants');

const guess = function(word, nspID, cb) {
    dao.query(insert, 'guess', word, word, nspID, nspID, () => {
        dao.query(update, 'guessEntered', nspID, () => {
            dao.query(update, 'wordCovered', nspID, word, nspID, () => {
                dao.query(get, 'guessResult', nspID, nspID, (result) => {
                    cb(result)
                })
            })
        })
    })
}

module.exports = guess