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
        this.namespace.on('players', res => {
            console.log(cb, res)
            cb(null, res)
        })
        this.namespace.emit('players')
    }

    sendNewPlayer(player) {
        this.namespace.emit('players', player)
    }

    sendReady() {
        this.namespace.emit('ready')
    }

    sendMessage(message) {
        this.namespace.emit('message', message)
    }

    getMessages(cb) {
        this.namespace.on('message', res => {
            cb(null, res)
        })
        this.namespace.emit('message')
    }

}

export default Api