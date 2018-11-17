const Player = require('./player');
const Game = require('./game');

const shortid = require('shortid');
const cookie = require('cookie');
const nodemailer = require('nodemailer');

const url = process.env.DEVURL;

const dao = require('./dao');
const game = require('./game');

const {get, insert, update, all, connection,
    player, session, displayName, unsorted, waitingReady,
    message, ready, team, teams, select, disconnect,
    checkPlayerMax, resetReady, joining, words} = require('./constants');

const guess = require('./guess')
const gameState = require('./gameState')

module.exports = class Namespace {

    constructor(io, nsp) {

        this.address = nsp;
        this.namespace = io.of("/" + nsp);
        this.namespace.on(connection, this.setListeners.bind(this))

    }

    setListeners(socket) {

        socket.on(session, () => {
            let sessionID = shortid.generate();
            dao.query('sessions', insert, null, sessionID, this.address, () => socket.emit(session, "id=" + sessionID));
        });

        socket.on(player, msg => {
            if (msg) {
                dao.query('sessions', update, displayName, msg.name, socket.client.id, cookie.parse(msg.cookie).id, () => {
                    dao.query('sessions', all, null, this.address, rows => {
                        dao.query('sessions', get, joining, this.address, row => {
                            socket.broadcast.emit(player, {players: rows, joining: row.count, to: 'everyone else'})
                            socket.emit(player, {players: rows, joining: row.count, name: msg.name, to: 'you'})
                        })
                    })
                })
            } else {
                dao.query('sessions', all, null, this.address, rows => {
                    dao.query('sessions', get, joining, this.address, row => {
                        this.namespace.emit(player, {players: rows, joining: row.count, to: 'all'})
                    })
                })
            }
        });

        socket.on(message, msg => {

            if (msg) {
                dao.query('chats', insert, null, this.address, msg.entry, msg.name, msg.socketID, msg.socketID, () => {
                    this.namespace.emit(message, msg)
                })
            } else {
                dao.query('chats', all, null, this.address, rows => {
                    socket.emit(message, rows)
                })
            }
        });

        socket.on(ready, (msg) => {

            let header = (msg === waitingReady) ? waitingReady : 'selectReady'

            if (msg === waitingReady) {
                dao.query('sessions', update, waitingReady, socket.client.id, () => {
                    dao.query('sessions', get, waitingReady, this.address, (row) => {
                        if (!row.count) {
                            let gameID = shortid.generate()
                            dao.query('games', insert, null, gameID, this.address, () => {
                                dao.query('players', insert, null, gameID, this.address, () => {
                                    dao.query('namespaces', update, null, 'select', this.address, () => {
                                        this.namespace.emit(ready)
                                    })
                                })
                            })
                        }
                    })
                })
            } else {
                dao.query('players', update, 'selectReady', socket.client.id, () => {
                    dao.query('players', get, 'selectReady', this.address, (row) => {
                        if (!row.count) {
                            dao.query('players', update, 'codemaster', msg, socket.client.id, () => {
                                dao.query('players', all, unsorted, this.address, players => {
                                    dao.query('players', get, checkPlayerMax, this.address, count => {
                                        let sorted = game.makeTeams(players, count)
                                        dao.query('players', update, teams, sorted, () => {
                                            let [board, first] = game.makeBoard(25)
                                            dao.query('words', insert, words, board, this.address, () => {
                                                dao.query('games', update, 'turn', first, this.address, () => {
                                                    dao.query('namespaces', update, null, 'game', this.address, () => {
                                                        this.namespace.emit(ready)
                                                    })
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        }
                    })
                })
            }
        });

        socket.on(select, (msg) => {
            dao.query('players', update, team, msg, socket.client.id, () => {
                dao.query('players', all, team, this.address, rows => {
                    console.log("Ahoy hoy", rows)
                    dao.query('players', get, checkPlayerMax, this.address, row => {
                        let max = Math.ceil(row.total / 2)
                        let blueMax = (row.blueCount >= max)
                        let redMax = (row.redCount >= max)
                        this.namespace.emit(select, {players: rows, blueMax: blueMax, redMax: redMax})
                    })
                })
            })
        });

        socket.on(team, () => {
            dao.query('players', get, team, socket.client.id, (res) => {
                socket.join(res.team)
                socket.emit(team, res)
            })
        })

        socket.on('game', () => {
            let words = new Board(socket.client.id, this.address)
            setTimeout(() => {socket.emit('game', words)}, 1000)
        })

        socket.on('turn', () => {
            dao.query('games', get, 'turn', this.address, turn => {
                dao.query('words', get, 'remaining', turn, this.address, remaining => {
                    socket.emit('turn', {...turn, ...remaining})
                })
            })
        })

        socket.on('guess', msg => {
            guess(msg, this.address, (result) => {
                socket.emit('guess', {type: result.type})
                gameState.handleGuess(this.address, result.type, result.team, () => {
                    console.log("And done!")
                })
            })
        })


        socket.on('codeword', msg => {
            if (msg) {
                dao.query('games', update, 'codeword', msg, this.address, () => {
                    socket.emit('codeword', msg)
                })
            }
        })

        socket.on(disconnect, () => {
            dao.query('sessions', update, disconnect, socket.client.id)
        })

    }

};

class Board {
    constructor(socketID, nspID) {

        this[0] = new Row(socketID, 0, nspID)
        this[1] = new Row(socketID, 1, nspID)
        this[2] = new Row(socketID, 2, nspID)
        this[3] = new Row(socketID, 3, nspID)
        this[4] = new Row(socketID, 4, nspID)

    }
}

class Row {
    constructor(socketID, row, nspID) {

        this.setWord(socketID, row, 0, nspID)
        this.setWord(socketID, row, 1, nspID)
        this.setWord(socketID, row, 2, nspID)
        this.setWord(socketID, row, 3, nspID)
        this.setWord(socketID, row, 4, nspID)

    }

    setWord(socketID, row, column, nspID) {
        dao.query('words', get, 'column', socketID, row, column, nspID, (word) => this[column] = word)
    }

}