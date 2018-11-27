const cookie = require('cookie');

const Promise = require('bluebird');

const handle = Promise.promisifyAll(require('./handlers'));

const logger = require('tracer').console();

const {connection, player, session, message, ready, team, select, disconnect} = require('./constants');

const gameState = require('./handlers/gameState');

module.exports = class Namespace {

    constructor(io, nsp) {

        this.address = nsp;
        this.namespace = io.of("/" + nsp);
        this.io = io

        this.namespace.on(connection, this.setListeners.bind(this))

    }

    // set rooms()

    setListeners(socket) {

        socket.on(session, () => {
            console.log("Yo", socket.id)
            console.log("Ahoy hoy", socket.client.id)
            handle.createSession(socket.client.id, this.address)
                .then(sessionID => {
                    socket.emit(session, "id=" + sessionID)
                })
                .catch(err => {
                    logger.log(err)
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
                    logger.log(err)
                })
        });

        socket.on('players', () => {
            handle.getAllSessions(this.address)
                .then(players => {
                    this.namespace.emit('players', players)
                })
                .catch(err => {
                    logger.log(err)
                })
        })

        socket.on('joining', () => {
            handle.getJoining(this.address)
                .then(joining => {
                    this.namespace.emit('joining', joining)
                })
                .catch(err => {
                    logger.log(err)
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
                    socket.emit('messages', messages)
                })
        })

        socket.on('waitingReady', () => {
            handle.setWaitingReady(socket.client.id, this.address)
                .then(ready => {
                    socket.emit('waitingReady')
                    // this.namespace.to(`${socket.client.id}`).emit('ready', "hey hey")
                    if (ready) {
                        this.namespace.emit('ready')
                    }
                })
                .catch(err => {
                    logger.log(err)
                })
        })

        socket.on('selectReady', () => {
            handle.setSelectReady(socket.client.id, this.address)
                .then(ready => {
                    socket.emit('selectReady')
                    if (ready) {
                        this.namespace.emit('ready')
                    }
                })
                .catch(err => {
                    logger.log(err)
                })
        })

        socket.on('select', (msg) => {
            handle.updatePlayerTeamSelect(msg, socket.client.id, this.address)
                .then(values => {
                    this.namespace.emit(select, values)
                })
                .catch(err => {
                    logger.log(err)
                })
        });

        socket.on('initialSelect', () => {
            handle.getAllPlayersTeamSelect(this.address)
                .then(values => {
                    socket.emit('select', values)
                })
                .catch(err => {
                    logger.log(err)
                })
        })

        // socket.on(team, () => {
        //     handle.getTeams(socket.client.id, (result, team) => {
        //         socket.join(team);
        //         socket.emit('team', result)
        //     })
        // });

        socket.on('gameInfo', () => {
            handle.getGameInfo()
            handle.getWords(socket.client.id, this.address)
                .then(board => {
                    socket.emit('game', board)
                })
                .catch(err => {
                    logger.log(err)
                })
        });

        socket.on('teamAndCodemaster', () => {
            handle.getTeamAndCodemaster(socket.client.id, this.address, (team, codemaster) => {
                socket.emit('teamAndCodemaster', {team, codemaster})
            })
        });

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