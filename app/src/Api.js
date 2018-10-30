import io from 'socket.io-client';

import store from "./store/store"
import {setID} from "./store/actions";

const url = 'http://localhost:5000/';

class API {
    constructor(){
        this.socket = io(url);

        this.socket.on('connect', () => {
            store.dispatch(setID(this.socket.id))
        })

    }

    set(header, payload, cb) {

        switch (header) {

            case namespace:
                this.socket.on(header, res => {
                    this.socket.off(header);
                    let address = url + payload;
                    this.socket = io(address);
                    cb(null, res)
                });
                this.socket.emit(header, payload);
                break;

            case ready:
                this.socket.on(header, res => {
                    this.socket.off(header);
                    cb(null, res)
                });
                this.socket.emit(header, payload);
                break;

            default:
                this.socket.emit(header, payload)

        }
    }

    get(header, cb) {

        switch (header) {

            case namespace:
            case resume:
                this.socket.on(header, res => {
                    this.socket.off(header);
                    let address = url + res.namespace;
                    this.socket = io(address);
                    cb(null, res)
                });
                this.socket.emit(header);
                break;

            default:
                this.socket.on(header, res => {
                    cb(null, res)
                });
                this.socket.emit(header)
        }

    }

}

const api = new API();
const player = 'player';
const select = 'select';
const message = 'message';
const namespace = 'namespace';
const session = 'session';
const ready = 'ready';
const resume = 'resume';


export {api, player, select, message, namespace, session, ready, resume}