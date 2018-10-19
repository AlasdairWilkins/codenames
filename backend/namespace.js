const Player = require('./player')

const nodemailer = require('nodemailer')

module.exports = class Namespace {

    constructor(io, gameCode) {

        const players = []
        const chat = []
        let total = 0

        const nsp = io.of("/" + gameCode)

        nsp.on('connection', function(socket) {

            socket.on('players', displayName => {
                if (displayName) {
                    players.push(new Player(displayName))

                } else {
                    total++
                }
                nsp.emit('players', {players: players, total: total})
            })

            socket.on('message', message => {
                if (message) {
                    chat.push(message)
                }
                nsp.emit('message', chat)
            })

            socket.on('ready', () => {

            })

            socket.on('disconnect', () => {
                total--
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
            //         };
            //
            //         transporter.sendMail(mailOptions, (error, info) => {
            //             if (error) {
            //                 return console.log(error);
            //             }
            //
            //         });
            // })

        })
    }

}