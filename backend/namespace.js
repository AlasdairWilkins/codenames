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


module.exports = class Namespace {

    constructor(io, nsp) {

        this.address = nsp;
        this.namespace = io.of("/" + nsp);
        this.namespace.on(connection, this.setListeners.bind(this))

    }

    setListeners(socket) {

        socket.on(session, () => {
            let sessionID = shortid.generate();
            dao.query(insert, session, sessionID, this.address, () => socket.emit(session, "id=" + sessionID));
        });

        socket.on(player, msg => {
            if (msg) {
                dao.query(update, displayName, msg.name, socket.client.id, cookie.parse(msg.cookie).id, () => {
                    dao.query(all, session, this.address, rows => {
                        dao.query(get, joining, this.address, row => {
                            socket.broadcast.emit(player, {players: rows, joining: row.count, to: 'everyone else'})
                            socket.emit(player, {players: rows, joining: row.count, name: msg.name, to: 'you'})
                        })
                    })
                })
            } else {
                dao.query(all, session, this.address, rows => {
                    dao.query(get, joining, this.address, row => {
                        this.namespace.emit(player, {players: rows, joining: row.count, to: 'all'})
                    })
                })
            }
        });

        socket.on(message, msg => {

            if (msg) {
                dao.query(insert, message, this.address, msg.entry, msg.name, msg.socketID, msg.socketID, () => {
                    this.namespace.emit(message, msg)
                })
            } else {
                dao.query(all, message, this.address, rows => {
                    socket.emit(message, rows)
                })
            }
        });

        socket.on(ready, (msg) => {

            dao.query(update, msg, socket.client.id, () => {
                dao.query(get, msg, this.address, (row) => {
                    if (!row.count) {
                        if (msg === waitingReady) {
                            let gameID = shortid.generate()
                            dao.query(insert, 'game', gameID, this.address, () => {
                                dao.query(insert, player, gameID, this.address, () => {
                                    dao.query(update, 'display', 'select', this.address, () => {
                                        this.namespace.emit(ready)
                                    })
                                })
                            })
                        } else {
                            dao.query(all, unsorted, this.address, players => {
                                dao.query(get, checkPlayerMax, this.address, count => {
                                    let sorted = game.makeTeams(players, count)
                                    dao.query(update, teams, sorted, () => {
                                        let board = game.makeBoard(25)
                                        dao.query(insert, words, board, this.address, () => {
                                            dao.query(update, 'display', 'game', this.address, () => {
                                                this.namespace.emit(ready)                                            })
                                        })
                                    })
                                })
                            })
                        }
                    }
                })
            })

        });

        socket.on(select, (msg) => {
            console.log("Hello", msg)
            dao.query(update, team, msg, socket.client.id, () => {
                dao.query(all, team, this.address, rows => {
                    dao.query(get, checkPlayerMax, this.address, row => {
                        let max = Math.ceil(row.total / 2)
                        let blueMax = (row.blueCount >= max)
                        let redMax = (row.redCount >= max)
                        this.namespace.emit(select, {players: rows, blueMax: blueMax, redMax: redMax})
                    })
                })
            })
        });

        socket.on(team, () => {
            dao.query(get, team, socket.client.id, (res) => {
                console.log("Ahoy hoy", res)
                socket.join(res.team)
                socket.emit(team, res)
            })
        })

        socket.on('game', () => {
            let words = new Board(this.address)
            console.log(words)

            setTimeout(() => {socket.emit('game', words)}, 1000)
        // socket.emit('game', rows)
    })


    socket.on(disconnect, () => {
            dao.query(update, disconnect, null, socket.client.id)
        })

    }

};

class Board {
    constructor(nspID) {

        this[0] = new Row(0, nspID)
        this[1] = new Row(1, nspID)
        this[2] = new Row(2, nspID)
        this[3] = new Row(3, nspID)
        this[4] = new Row(4, nspID)

    }
}

class Row {
    constructor(row, nspID) {

        this.setWord(row, 0, nspID)
        this.setWord(row, 1, nspID)
        this.setWord(row, 2, nspID)
        this.setWord(row, 3, nspID)
        this.setWord(row, 4, nspID)

    }

    setWord(row, column, nspID) {
        dao.query(get, 'column', row, column, nspID, (word) => this[column] = word)
    }

}