const Player = require('./player');
const Game = require('./game');

const shortid = require('shortid');
const cookie = require('cookie');
const nodemailer = require('nodemailer');

const dao = require('./dao');

const {get, insert, update, all, connection,
    player, session, displayName,
    message, ready, team, select, disconnect,
    checkPlayerMax, resetReady, joining} = require('./constants');


module.exports = class Namespace {

    constructor(io, nsp) {

        this.chat = [];
        this.games = [];
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

            dao.query(all, player, this.address, rows => {
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

        socket.on(ready, () => {

            dao.query(update, ready, socket.client.id, () => {
                dao.query(get, ready, this.address, (row) => {
                    if (!row.count) {
                        dao.query(update, resetReady, this.address, () => {
                            this.namespace.emit(ready)
                        })
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