import io from 'socket.io-client';

const url = 'http://localhost:5000/'

const socket = io(url);

class Api {
    constructor(){
        this.namespace = null
    }

    getNamespace(cb) {
        socket.on('namespace', namespace => {
            socket.off('namespace')
            cb(null, namespace)
        })
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

    getCookie(gameCode) {
        socket.on('cookie', cookie => {
            socket.off('cookie')
            document.cookie = cookie
        })
        socket.emit('cookie', gameCode)
    }

    getPlayers(cb) {
        this.namespace.on('players', res => {
            cb(null, res)
        })
        this.namespace.emit('players')
    }

    sendNewPlayer(player) {
        this.namespace.emit('players', {name: player, cookie: document.cookie})
    }

    sendReady(cb) {
        this.namespace.on('ready', () => {
            this.namespace.off('ready')
            cb(null)
        })
        this.namespace.emit('ready', document.cookie)
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