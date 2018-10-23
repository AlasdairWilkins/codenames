import io from 'socket.io-client';

import store from "./store/store"
import {setID} from "./store/actions";

const url = 'http://localhost:5000/'

const socket = io(url);

class API {
    constructor(){
        this.namespace = null

        socket.on('connect', () => {
            store.dispatch(setID(socket.id))
        })
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

    sendReady(cb) {
        this.namespace.on('ready', () => {
            this.namespace.off('ready')
            cb(null)
        })
        this.namespace.emit('ready', document.cookie)
    }

    sendNewPlayer(player) {
        this.namespace.emit('players', {name: player, cookie: document.cookie})
    }

    getPlayers(cb) {
        this.namespace.on('players', res => {
            cb(null, res)
        })
        this.namespace.emit('players')
    }

    sendSelect(team) {
        this.namespace.emit('select', team)
    }

    getSelects(cb) {
        this.namespace.on('select', res => {
            cb(null, res)
        })
        this.namespace.emit('select')
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

const api = new API()
const players = 'players'
const select = 'select'
const message = 'message'

export default api