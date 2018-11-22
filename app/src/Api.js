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

    set(header, payload, cb) {
        this.socket.on(header, res => {
            this.socket.off(header);
            cb(null, res)
        });
        this.socket.emit(header, payload)
    }

    get(header, cb) {
        this.socket.on(header, res => {
            socket.off(header);
            cb(null, res)
        });
        this.socket.emit(header)
    }

    subscribe(header) {
        this.socket.on(header, res => {
            cb(null, res)
        });
        socket.emit(header)
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