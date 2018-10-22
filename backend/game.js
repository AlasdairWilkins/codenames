const words = require('./words')

module.exports = class Game {
    constructor() {
        this.players = ['Ben', 'Aneliese', 'Ezra', 'Katherine']

        for (let i in words) {
            console.log(words[i])
        }
    }
}

