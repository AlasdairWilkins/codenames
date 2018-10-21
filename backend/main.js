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
        if (server.cookies[idCookie]) {
            console.log("Success!")
            let namespace = server.cookies[idCookie]
            let player = findPlayer(server.namespaces[namespace], idCookie)
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

    socket.on('cookie', gameCode => {
        let newCookie = shortid.generate()
        server.cookies[newCookie] = gameCode
        socket.emit('cookie', "id=" + newCookie)
    })

    // socket.on('recover')

})

function findPlayer(namespace, cookie) {
    console.log(cookie)
    let players = namespace.players
    for (let i in players) {
        console.log(players[i])
        if (players[i].cookie === cookie) {
            return players[i]
        }
    }
    return null
}


const port = 5000;
io.listen(port);
console.log('Listening on port', port);