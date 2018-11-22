const cookie = require('cookie');

const Promise = require('bluebird')

const handle = Promise.promisifyAll(require('./handlers'));

const {connection, player, session, message, ready, team, select, disconnect} = require('./constants');

const gameState = require('./gameState');

module.exports = class Namespace {

    constructor(io, nsp) {

        this.address = nsp;
        this.namespace = io.of("/" + nsp);
        this.namespace.on(connection, this.setListeners.bind(this))

    }

    setListeners(socket) {

        console.log("Executing!")

        socket.on(session, () => {
            console.log("Allo allo")
            handle.createSession(this.address)
                .then(function(sessionID) {
                    console.log("Here!", sessionID)
                    socket.emit(session, "id=" + sessionID)
                })
                .catch(function(err) {
                    console.error(err.message)
                }
            )
        });

        socket.on(player, msg => {
            if (msg) {
                handle.setDisplayName(msg.name, socket.client.id, cookie.parse(msg.cookie).id, this.address,
                    (players, joining) => {
                        handle.getDisplayName(cookie.parse(msg.cookie).id, this.address, name => {
                            socket.broadcast.emit(player, {players, joining, to: 'everyone else'});
                            socket.emit(player, {players, joining, name, to: 'you'})
                        })

                })
            } else {
                handle.getAllSessions(this.address, (players, joining) => {
                    this.namespace.emit(player, {players, joining, to: 'all'})
                })
            }
        });

        socket.on(message, msg => {
            if (msg) {
                handle.addChat(this.address, msg.entry, msg.name, msg.socketID, () => {
                    // handle.getChat(, result => {
                        this.namespace.emit(message, msg)
                    // })
                })
            } else {
                handle.getAllChats(this.address, rows => {
                    socket.emit('message', rows)
                })
            }
        });

        socket.on(ready, (msg) => {

            let header = (msg === 'waitingReady') ? 'sessions' : 'players';

            handle.setReady(header, socket.client.id, () => {
                handle.checkAllReady(header, this.address, count => {
                    if (!count) {
                        if (msg === 'waitingReady') {
                            handle.createGame(this.address, () => {
                                this.namespace.emit(ready)
                            })
                        } else {
                            handle.getUnsortedPlayers(this.address, (players, count) => {
                                gameState.handleMakeTeams(players, count, () => {
                                    gameState.handleMakeBoard(this.address, () => {
                                        gameState.handleSetCodemaster(this.address, () => {
                                            this.namespace.emit(ready)
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
            handle.updatePlayerTeamSelect(msg, socket.client.id, () => {
                handle.getAllPlayersTeamSelect(this.address, (players, blueMax, redMax) => {
                    this.namespace.emit(select, {players, blueMax, redMax})
                })
            })
        });

        socket.on(team, () => {
            handle.getTeams(socket.client.id, (result, team) => {
                socket.join(team);
                socket.emit('team', result)
            })
        });

        socket.on('game', () => {
            handle.getWords(socket.client.id, this.address, board => {
                socket.emit('game', board)
            })
        });

        socket.on('teamAndCodemaster', () => {
            handle.getTeamAndCodemaster(socket.client.id, this.address, (team, codemaster) => {
                socket.emit('teamAndCodemaster', {team, codemaster})
            })
        })

        socket.on('turn', () => {
           handle.getTurnAndRemainingWords(this.address, (turn, remaining) => {
               console.log("Ahoy hoy", turn, remaining)
               socket.emit('turn', {turn, remaining})
           })
        });

        socket.on('guess', msg => {
            handle.guess(msg, this.address, (result) => {
                socket.emit('guess', {type: result.type});
                gameState.handleGuess(this.address, result.type, result.team, () => {
                    console.log("And done!")
                })
            })
        });


        socket.on('codeword', msg => {
            if (msg) {
                handle.updateCodeWord(msg, this.address, () => {
                    handle.getCodeWord(this.address, codeword => {
                        socket.emit('codeword', codeword)
                    })
                })
            }
        });

        socket.on(disconnect, () => {
            handle.removeSocketIDOnDisconnect(socket.client.id)
        });

    }

};