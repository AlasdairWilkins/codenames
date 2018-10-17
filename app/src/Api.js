import io from 'socket.io-client';
const url = 'http://localhost:5000/'
const socket = io(url);

class Api {

    setNamespace(gameCode) {
        let address = url + gameCode
        return io(address)
    }

    getGameCode(cb) {
        socket.on('code', code => {
            socket.off('code')
            cb(null, code)
        })
        socket.emit('new');
    }

    sendGameCode(gameCode, cb) {
        socket.on('code', code => {
            socket.off('code')
            cb(null, code)
        })
        socket.emit('existing', gameCode)
    }

    getPlayers(nsp, cb) {
        nsp.on('players', players => {
            cb(null, players)
        })
        nsp.emit('players')
    }

    sendNewPlayer(nsp, player) {
        nsp.emit('newPlayer', player)
    }

}

export default Api