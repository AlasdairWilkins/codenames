
const dao = require('./dao');
const {get, insert, update} = require('./constants');

const game = require('./game')

class GameState {

    handleUpdatedGameState(nspID, callback) {
        dao.query('games', get, 'gameState', nspID, (err, result) => {
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
            dao.query('games', update, "gameOver", 0, 0, nspID, (err) => {
                this.handleUpdatedGameState(nspID, callback)
            })

        } else if (type === 'decoy') {
            dao.query('games', update, 'newTurn', nspID, (err) => {
                this.handleUpdatedGameState(nspID, callback)
            })
        } else if (type !== team) {
            dao.query('games', update, 'newTurn', nspID, (err) => {
                this.handleUpdatedGameState(nspID, callback)
            })
        } else {
            this.handleUpdatedGameState(nspID, callback)
        }
    }

    handleMakeTeams(players, count, callback) {
        let sorted = game.makeTeams(players, count);
        console.log(sorted)
        dao.query('players', 'update', 'teams', sorted, (err) => {
            callback()
        })
    }

    handleMakeBoard(nspID, callback) {
        let [board, first] = game.makeBoard(25);
        dao.query('words', insert, 'words', board, nspID, (err) => {
            dao.query('games', update, 'turn', first, nspID, (err) => {
                dao.query('namespaces', update, 'game', nspID, (err) => {
                    callback()
                })
            })
        })
    }

    handleSetCodemaster(nspID, callback) {
        dao.query('players', 'all', 'teamColor', 'blue', nspID, (err, teamBlue) => {
            dao.query('players', 'all', 'teamColor', 'red', nspID, (err, teamRed) => {
                console.log(teamBlue, teamRed)
                let blueCodemasterIndex = Math.floor(Math.random()*teamBlue.length)
                let redCodemasterIndex = Math.floor(Math.random()*teamRed.length)
                let blueCodemaster = teamBlue[blueCodemasterIndex].sessionID
                let redCodemaster = teamRed[redCodemasterIndex].sessionID
                dao.query('players', 'update', 'codemaster', true, blueCodemaster, (err) => {
                    dao.query('players', 'update', 'codemaster', true, redCodemaster, (err) => {
                        callback()
                    })
                })
            })
        })
        // let blueCodemaster =
    }

}

module.exports = new GameState();