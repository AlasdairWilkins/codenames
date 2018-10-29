const Player = require('./player');
const Game = require('./game');

const shortid = require('shortid');
const cookie = require('cookie');
const nodemailer = require('nodemailer');

const server = require('./main');
const dao = require('./dao');

module.exports = class Namespace {

    constructor(io, namespace) {

        this.chat = [];
        this.games = [];
        this.address = namespace;

        this.namespace = io.of("/" + namespace);

        this.namespace.on('connection', this.setListeners.bind(this))

    }

    setListeners(socket) {

        socket.on('cookie', () => {
            let sessionID = shortid.generate();
            dao.query('insert', 'session', sessionID, this.address, () => socket.emit('cookie', "id=" + sessionID));
        });

        socket.on('players', req => {
            if (req) {
                dao.query('update', 'displayName', req.name, socket.client.id, cookie.parse(req.cookie).id)
            }

            dao.query('all', 'players', this.address, rows => {
                dao.query('get', 'joining', this.address, row => {
                    this.namespace.emit('players', {players: rows, total: row.count})
                })
            })
        });

        socket.on('message', message => {

            if (message) {

                dao.query('insert', 'chat', this.address, message, socket.client.id, socket.client.id, () => {
                    dao.query('all', 'messages', this.address, rows => {
                        this.namespace.emit('message', rows)
                    })
                })
            } else {
                dao.query('all', 'messages', [this.address], rows => {
                    this.namespace.emit('message', rows)
                })
            }
        });

        socket.on('ready', () => {

            dao.query('update', 'ready', socket.client.id, () => {
                dao.query('get', 'ready', this.address, (row) => {
                    if (!row.count) {
                        this.namespace.emit('ready')
                    }
                })
            })

        });

        socket.on('select', (team) => {

            dao.query('update', 'team', team, socket.client.id, () => {
                dao.query('all', 'teams', this.address, rows => {
                    this.namespace.emit('players', {players: rows})
                })
            })
        });

        socket.on('disconnect', () => {
            dao.query('update', 'disconnect', null, socket.client.id)
        })

    }

};