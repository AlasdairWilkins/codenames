const Player = require('./player');
const Game = require('./game');

const shortid = require('shortid');
const ck = require('cookie');
const nodemailer = require('nodemailer');

const server = require('./main');
const dao = require('./dao');

const {get, insert, update, all, connection,
    cookie, players, session, displayName, player,
    message, ready, team, select, disconnect} = require('./constants');


module.exports = class Namespace {

    constructor(io, nsp) {

        this.chat = [];
        this.games = [];
        this.address = nsp;

        this.namespace = io.of("/" + nsp);

        this.namespace.on(connection, this.setListeners.bind(this))

    }

    setListeners(socket) {

        socket.on(cookie, () => {
            let sessionID = shortid.generate();
            dao.query(insert, session, sessionID, this.address, () => socket.emit(cookie, "id=" + sessionID));
        });

        socket.on(players, msg => {
            if (msg) {
                dao.query(update, displayName, msg.name, socket.client.id, ck.parse(msg.cookie).id)
            }

            dao.query(all, players, this.address, rows => {
                dao.query(get, 'joining', this.address, row => {
                    this.namespace.emit(player, {players: rows, total: row.count})
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
                        this.namespace.emit(ready)
                    }
                })
            })

        });

        socket.on(select, (msg) => {

            dao.query(update, team, msg, socket.client.id, () => {
                dao.query(all, team, this.address, rows => {
                    this.namespace.emit(player, {players: rows})
                })
            })
        });

        socket.on(disconnect, () => {
            dao.query(update, disconnect, null, socket.client.id)
        })

    }

};