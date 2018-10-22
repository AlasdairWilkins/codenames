const Player = require('./player')
const Game = require('./game')

const cookie = require('cookie')
const nodemailer = require('nodemailer')

module.exports = class Namespace {

    constructor(io, gameCode) {

        this.players = []
        this.chat = []
        this.total = 0
        this.games = []

        this.namespace = io.of("/" + gameCode)

        this.namespace.on('connection', this.setListeners.bind(this))

    }

    setListeners(socket) {

        console.log(this.total)

        socket.on('players', req => {
            if (req) {
                this.players.push(new Player(req.name, cookie.parse(req.cookie).id, socket.client.id))
            } else {
                this.total++
            }
            this.namespace.emit('players', {players: this.players, total: this.total})
        })

        socket.on('message', message => {
            if (message) {
                this.chat.push(message)
            }
            this.namespace.emit('message', this.chat)
        })

        socket.on('ready', () => {
            let player = this.findPlayer('socketID', socket.client.id)
            if (player != null) {
                this.players[player].ready = true
            }
            if (this.players.length === this.total) {
                if (this.checkReady) {
                    socket.emit('ready')
                    this.games.push(new Game)
                }
            }
        })

        socket.on('disconnect', () => {
            let player = this.findPlayer('socketID', socket.client.id)
            this.players[player].socketID = null
            this.total--
            console.log(this.players)
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

    findPlayer(key, value) {
        for (let i in this.players) {
            if (this.players[i][key] === value) {
                return i
            }
        }
        return null
    }

    checkReady() {
        for (let i in this.players) {
            if (!this.players[i].ready) {
                return false
            }
        }
        return true
    }

}