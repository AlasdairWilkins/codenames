import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:5000/');

class Api {

    getGameCode(cb) {
        socket.on('newCode', code => {
            socket.off('newCode')
            cb(null, code)
        })
        socket.emit('newCode');
    }

    getPlayers(code, cb) {
        console.log("Hi")
        socket.on('players', players => {
            cb(null, players)
        })
        socket.emit('players', code)
    }

    sendNewPlayer(code, player) {
        socket.emit('newPlayer', {code: code, player: player})
    }

}

export default Api