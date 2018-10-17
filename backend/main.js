// const express = require('express');
//
// const app = express();
// const port = process.env.PORT || 5000;
//
// app.get('/api/hello', (req, res) => {
//     res.send({ express: 'Hello From Express' });
// });
//
// app.listen(port, () => console.log(`Listening on port ${port}`));

const io = require('socket.io')();
const shortid = require('shortid')

const Game = require('./game')
const Server = require('./server')

const server = new Server()

io.on('connection', function(socket) {

    socket.on('newCode', function() {
        let gameCode = shortid.generate()
        server.games[gameCode] = new Game(gameCode)
        socket.emit('newCode', gameCode)
    })

    socket.on('players', function(gameCode) {
        console.log("Players request received!")
        console.log(server)
        socket.emit('players', server.games[gameCode].players)
    })

    socket.on('newPlayer', function(msg) {
        let [gameCode, player] = [msg.gameCode, msg.player]
        server.games[gameCode].players.push(player)
    })

})

const port = 5000;
io.listen(port);
console.log('Listening on port', port);