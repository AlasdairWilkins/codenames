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
                let params = [req.name, socket.client.id, cookie.parse(req.cookie).id];
                dao.update('displayName', params)
            }

            dao.all('players', [this.address], rows => {
                dao.get('joining', [this.address], row => {
                    this.namespace.emit('players', {players: rows, total: row.count})
                })
            })
        });

        socket.on('message', message => {

            if (message) {

                let params = [this.address, message, socket.client.id, socket.client.id];
                dao.insert('chat', params, () => {
                    dao.all('messages', [this.address], rows => {
                        this.namespace.emit('message', rows)
                    })
                })
            } else {
                dao.all('messages', [this.address], rows => {
                    this.namespace.emit('message', rows)
                })
            }
        });

        socket.on('ready', () => {

            let params = [socket.client.id];

            dao.update('ready', params, () => {

                let getParams = [this.address];

                dao.get('ready', getParams, (row) => {
                    if (!row.count) {
                        this.namespace.emit('ready')
                    }
                })
            })

        });

        socket.on('select', (team) => {


            let params = [team, socket.client.id];

            dao.update('team', params, () => {
                dao.all('teams', [this.address], rows => {
                    this.namespace.emit('players', {players: rows})
                })
            })
        });

        socket.on('disconnect', () => {
            let params = [null, socket.client.id];
            dao.update('disconnect', params)
        })

        // socket.on('email', () => {
        //     socket.on('sendcode', function(msg){
        //         let link = `${url}/?code=${msg.code}`
        //         let transporter = nodemailer.createTransport({
        //             service: 'gmail',
        //             auth: {
        //                 user: process.env.EMAIL,
        //                 pass: process.env.EMAIL_PW
        //             },
        //             tls: {
        //                 rejectUnauthorized: false
        //             }
        //         });
        //
        //         let mailOptions = {
        //             to: ...invites,
        //             subject: "You've been invited to play a game of The Fox in the Forest!",
        //             text: `Go to http://fox-forest.alasdairwilkins.com and enter ${msg.code} when it asks for a game code.`,
        //             html: `Go to <a href="${url}?code=${msg.code}">fox-forest.alasdairwilkins.com</a> and enter ${msg.code} when it asks for a game code. Good luck!`
        //             //         };
        //             //
        //             //         transporter.sendMail(mailOptions, (error, info) => {
        //             //             if (error) {
        //             //                 return console.log(error);
        //             //             }
        //             //
        //             //         });
        // })
    }

};