require('dotenv').config()


const io = require('socket.io')();
const shortid = require('shortid')
const cookie = require('cookie')

const Game = require('./game')
const Server = require('./server')
const Namespace = require('./namespace')

const url = process.env.DEVURL

const server = new Server()

io.on('connection', function(socket) {

    if (socket.handshake.headers.cookie && cookie.parse(socket.handshake.headers.cookie).id) {
        let idCookie = cookie.parse(socket.handshake.headers.cookie).id
        let [namespace, player] = findPlayer(server.namespaces, idCookie)

        if (namespace && player) {
            console.log("Success!")
            socket.emit('namespace', {namespace: namespace, player: player})
        }
    }

    if (socket.handshake.query.code) {
        let gameCode = socket.handshake.query.code
        if (server.namespaces[gameCode]) {
            socket.emit('code', gameCode)
        } else {
            console.log("whoops")
        }
    }

    socket.on('new', () => {
        let gameCode = shortid.generate()
        server.namespaces[gameCode] = new Namespace(io, gameCode, socket)
        socket.emit('code', gameCode)
    })

    socket.on('existing', gameCode => {
        if (server.namespaces[gameCode]) {
            socket.emit('code', true)
        }
        socket.emit('code', false)
    })

    // socket.on('recover')

})

function findPlayer(namespaces, cookie) {
    for (let namespace in namespaces) {
        let players = namespaces[namespace].players
        for (let i in players) {
            if (players[i].cookie === cookie) {
                return [namespace, players[i]]
            }
        }
    }
    return [null, null]
}


const port = 5000;
io.listen(port);
console.log('Listening on port', port);