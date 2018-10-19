const Player = require('./player')

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

        })
    }

}