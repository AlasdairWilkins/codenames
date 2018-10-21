const Game = require('./game')

module.exports = class Server {
    constructor() {
        this.namespaces = {}
        this.cookies = {}
        this.games = {}
    }
}
