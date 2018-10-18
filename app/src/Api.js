import io from 'socket.io-client';
const url = 'http://localhost:5000/'
const socket = io(url);

class Api {
    constructor(){
        this.namespace = null
    }

    setNamespace(gameCode) {
        let address = url + gameCode
        this.namespace = io(address)
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

    getPlayers(cb) {
        this.namespace.on('players', msg => {
            console.log(cb, msg)
            cb(null, msg)
        })
        this.namespace.emit('players')
    }

    sendNewPlayer(player) {
        this.namespace.emit('players', player)
    }

}

export default Api