const dao = require('../dao')

const getWords = function(clientID, nspID, callback) {
    dao.query('words', 'all', 'board', clientID, nspID, board => {
        callback(new Board(board))
    })
}

class Board {
    constructor(words) {

        this[0] = new Row(words.slice(0, 5));
        this[1] = new Row(words.slice(5, 10));
        this[2] = new Row(words.slice(10, 15));
        this[3] = new Row(words.slice(15, 20));
        this[4] = new Row(words.slice(20, 25))

    }
}

class Row {
    constructor(words) {

        console.log(words);

        this[0] = words[0];
        this[1] = words[1];
        this[2] = words[2];
        this[3] = words[3];
        this[4] = words[4]

    }

}

module.exports = {getWords}