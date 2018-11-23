import io from 'socket.io-client';

import store from "./store/store"
import {set} from "./store/actions";

const url = 'http://localhost:5000/';

class API {
    constructor(){
        this.socket = io(url);

        this.socket.on('connect', () => {
            store.dispatch(set('id', this.socket.id));
            store.dispatch(set('display', 'welcome'))
        })

    }

    ping(header, callback) {
        this.socket.on(header, () => {
            this.socket.off(header)
            callback(null)
        })
        this.socket.emit(header)
    }

    send(header, payload) {
        this.socket.emit(header, payload)
    }

    set(header, payload, callback) {
        this.socket.on(header, res => {
            this.socket.off(header);
            callback(null, res)
        });
        this.socket.emit(header, payload)
    }

    get(header, callback) {
        this.socket.on(header, res => {
            this.socket.off(header);
            callback(null, res)
        });
        this.socket.emit(header)
    }

    request(header) {
        this.socket.emit(header)
    }

    subscribe(header, callback) {
        this.socket.on(header, res => {
            callback(null, res)
        });
    }

    unsubscribe(header) {
        this.socket.off(header)
    }


    set address(address) {
        this.socket = io(url + address)
    }

}

const api = new API();



export {api}