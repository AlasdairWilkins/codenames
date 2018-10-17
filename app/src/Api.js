import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:5000/');

class Api {

    getGameCode(cb) {
        socket.on('codeConfirmed', code => {
            socket.off('codeConfirmed')
            cb(null, code)
        })
        socket.emit('newCode');
    }

    sendGameCode(code, cb) {
        socket.on('codeConfirmed', codeConfirmed => {
            socket.off('codeConfirmed')
            cb(null, codeConfirmed)
        })
        socket.emit('existingCode', code)
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