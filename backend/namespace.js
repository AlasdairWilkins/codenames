const Player = require('./player');
const Game = require('./game');

const shortid = require('shortid');
const cookie = require('cookie');
const nodemailer = require('nodemailer');

const dao = require('./dao');
const game = require('./game');

const {get, insert, update, updateMultiple, all, connection,
    player, session, displayName,
    message, ready, team, teams, select, disconnect,
    checkPlayerMax, resetReady, joining} = require('./constants');


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
                dao.query(update, displayName, msg.name, socket.client.id, cookie.parse(msg.cookie).id)
            }

            dao.query(all, session, this.address, rows => {
                dao.query(get, joining, this.address, row => {
                    this.namespace.emit(player, {players: rows, joining: row.count})
                })
            })
        });

        socket.on(message, msg => {

            if (msg) {

                dao.query(insert, message, this.address, msg, socket.client.id, socket.client.id, () => {
                    dao.query(all, message, this.address, rows => {
                        this.namespace.emit(message, rows)
                    })
                })
            } else {
                dao.query(all, message, [this.address], rows => {
                    this.namespace.emit(message, rows)
                })
            }
        });

        socket.on(ready, (msg) => {

            dao.query(update, msg, socket.client.id, () => {
                dao.query(get, msg, this.address, (row) => {
                    if (!row.count) {
                        if (msg === 'waitingReady') {
                            let gameID = shortid.generate()
                            dao.query(insert, player, gameID, this.address, () => {
                                this.namespace.emit(ready)
                            })
                        } else {
                            dao.query(all, 'unsorted', this.address, players => {
                                dao.query(get, checkPlayerMax, this.address, count => {
                                    let sorted = game.makeTeams(players, count)
                                    dao.query(update, teams, sorted, () => {
                                        console.log("All updated!")
                                    })
                                })
                            })
                        }
                    }
                })
            })

        });

        socket.on(select, (msg) => {

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

        socket.on(disconnect, () => {
            dao.query(update, disconnect, null, socket.client.id)
        })

    }

};