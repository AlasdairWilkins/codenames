require('dotenv').config()


const io = require('socket.io')();
const shortid = require('shortid')

const Game = require('./game')
const Server = require('./server')
const Namespace = require('./namespace')

const url = process.env.DEVURL

const server = new Server()

io.on('connection', function(socket) {

    if (socket.handshake.query.code) {
        let gameCode = socket.handshake.query.code
        if (server.namespaces[gameCode]) {
            socket.emit('code', gameCode)
        } else {
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

const port = 5000;
io.listen(port);
console.log('Listening on port', port);