const Game = require('../game')
const Player = require('../player')

let players = [
    new Player("Alasdair"),
    new Player("Kaley"),
    new Player("Steph"),
    new Player("Steven"),
    new Player("Jonathan"),
    new Player("Kevin"),
    new Player("Brian"),
    new Player("Rae"),
    new Player("Ben")
    ]

for (let i in players) {
    if (i == 0 || i == 1) {
        players[i].team = 'blue'
    } else if (i == 2 || i == 3) {
        players[i].team = 'red'
    }
}

let game = new Game(players)