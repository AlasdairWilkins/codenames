import io from 'socket.io-client';

import store from "./store/store"
import {setID} from "./store/actions";

const url = 'http://localhost:5000/'

// const socket = io(url);

class API {
    constructor(){
        this.socket = io(url)
        // this.namespace = null

        this.socket.on('connect', () => {
            store.dispatch(setID(this.socket.id))
        })
    }

    set(header, payload, cb) {

        switch (header) {

            case namespace:
                let address = url + payload
                this.socket = io(address)
                break

            case ready:
                this.socket.on(header, res => {
                    this.socket.off(header)
                    cb(null, res)
                })
                this.socket.emit(header, payload)
                break

            case cookie:
                this.socket.on(header, res => {
                    this.socket.off(header)
                    document.cookie = res
                })
                this.socket.emit(header, payload)
                break

            default:
                this.socket.emit(header, payload)

        }
    }

    get(header, cb) {


        switch (header) {

            case namespace:
                this.socket.on(header, res => {
                    this.socket.off(header)
                    cb(null, res)
                })
                break

            default:
                this.socket.on(header, res => {
                    cb(null, res)
                })
                this.socket.emit(header)
        }

    }

    getNamespace(cb) {

    }

    getGameCode(cb) {
        this.socket.on('code', code => {
            this.socket.off('code')
            cb(null, code)
        })
        this.socket.emit('new');
    }

    sendGameCode(gameCode, cb) {
        this.socket.on('code', code => {
            this.socket.off('code')
            cb(null, code)
        })
        this.socket.emit('existing', gameCode)
    }


    // getCookie(gameCode) {
    //     this.socket.on('cookie', cookie => {
    //         this.socket.off('cookie')
    //         document.cookie = cookie
    //     })
    //     this.socket.emit('cookie', gameCode)
    // }
}

const api = new API()
const players = 'players'
const select = 'select'
const message = 'message'
const namespace = 'namespace'
const cookie = 'cookie'
const ready = 'ready'


export {api, players, select, message, namespace, cookie, ready}