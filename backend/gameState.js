
const dao = require('./dao');
const {get, insert, update} = require('./constants');

class GameState {
    
    handleGuess(type, team) {
        if (type === 'assassin') {
            dao.query(update, "gameOver", 0, 0, this.address, () => {
                console.log("Game over!")
            })

        } else if (type === 'decoy') {
            dao.query(update, 'newTurn', this.address, () => {
                console.log("That's a decoy!")
            })
        } else if (type !== team) {
            dao.query(update, 'newTurn', this.address, () => {
                console.log("You just helped the other team!")
            })
        } else {

        }
    }
    
}

module.exports = new GameState()