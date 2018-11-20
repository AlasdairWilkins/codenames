const dao = require('../dao')

const getWords = function(clientID, nspID, callback) {
    dao.query('words', 'all', 'board', clientID, nspID, (err, board) => {
        callback(new Board(board))
    })
}

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

module.exports = {getWords}