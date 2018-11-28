const dao = require('../dao');

const getWords = function(clientID, nspID) {
    return new Promise((resolve, reject) => {
        dao.query('words', 'all', 'board', clientID, nspID)
            .then(words => {
                resolve(new Board(words))
            })
            .catch(err => {
                reject(err)
            })
    })
};

class Board {
    constructor(words) {

        for (let i = 0; i < 5; i++) {
            this[i] = new Row(words.slice(i * 5, (i + 1) * 5))
        }

    }
}

class Row {
    constructor(words) {

        for (let i = 0; i < 5; i++) {
            this[i] = words[i]
        }

    }

}

module.exports = {getWords};