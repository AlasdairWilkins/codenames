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

        socket.on(session, () => {
            handle.createSession(socket.client.id, this.address)
                .then(sessionID => {
                    socket.emit(session, "id=" + sessionID)
                })
                .catch(err => {
                    console.error(err.message)
                }
            )
        });

        socket.on('displayName', nameMsg => {
            handle.newDisplayName(nameMsg, socket.client.id, this.address)
                .then(values => {
                    socket.emit('displayName', values.name)
                    this.namespace.emit('players', values.players)
                    this.namespace.emit('joining', values.joining)
                })
                .catch(err => {
                    console.error(err.message)
                })
        });

        socket.on('players', () => {
            handle.getAllSessions(this.address)
                .then(players => {
                    this.namespace.emit('players', players)
                })
                .catch(err => {
                    console.error(err.message)
                })
        })

        socket.on('joining', () => {
            handle.getJoining(this.address)
                .then(joining => {
                    this.namespace.emit('joining', joining)
                })
                .catch(err => {
                    console.error(err.message)
                })
        })

        socket.on('message', msg => {
                handle.addChat(this.address, msg.entry, msg.name, msg.socketID)
                    .then(message => {
                        this.namespace.emit('messages', message)
                })
        });

        socket.on('messages', msg => {
            handle.getAllChats(this.address)
                .then(messages => {
                    this.namespace.emit('messages', messages)
                })
        })

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