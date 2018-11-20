const chats = require('./chats');
const games = require('./games');
const guesses = require('./guesses');
const namespaces = require('./namespaces');
const players = require('./players');
const sessions = require('./sessions');
const words = require('./words');

const {drop} = require('./templates');

class SQL {
    constructor(){
        this.chats = chats;
        this.games = games;
        this.guesses = guesses;
        this.namespaces = namespaces;
        this.players = players;
        this.sessions = sessions;
        this.words = words
    }

    drop(table) {
        return drop(table)
    }


}

module.exports = new SQL();