const Player = require('./player')

const nodemailer = require('nodemailer')
const shortid = require('shortid')

module.exports = class Namespace {

    constructor(io, gameCode) {

        this.players = []
        this.chat = []
        this.total = 0

        this.namespace = io.of("/" + gameCode)

        this.namespace.on('connection', this.setListeners.bind(this))

    }

    setListeners(socket) {

        socket.on('players', displayName => {
            if (displayName) {
                let cookie = shortid.generate()
                this.players.push(new Player(displayName, cookie))
                socket.emit('cookie', "id=" + cookie)
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

        })

        socket.on('disconnect', () => {
            this.total--
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

}