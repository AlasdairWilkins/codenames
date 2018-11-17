
const dao = require('./dao');
const {get, insert, update} = require('./constants');

class GameState {

    handleUpdatedGameState(nspID, callback) {
        dao.query('games', get, 'gameState', nspID, (result) => {
            if (!result.active) {
                callback("Handle game over")
                //handle game over notification
            } else if (!result.codeword) {
                callback("Ask for new codeword")
                //ask codemaster for result.team for new codeword
            } else {
                callback("Allow new guess")
                //allow new guess
            }
        })
    }
    
    handleGuess(nspID, type, team, callback) {
        if (type === 'assassin') {
            dao.query('games', update, "gameOver", 0, 0, nspID, () => {
                this.handleUpdatedGameState(nspID, callback)
            })

        } else if (type === 'decoy') {
            dao.query('games', update, 'newTurn', nspID, () => {
                this.handleUpdatedGameState(nspID, callback)
            })
        } else if (type !== team) {
            dao.query('games', update, 'newTurn', nspID, () => {
                this.handleUpdatedGameState(nspID, callback)
            })
        } else {
            this.handleUpdatedGameState(nspID, callback)
        }
    }
    
}

module.exports = new GameState()