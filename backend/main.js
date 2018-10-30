require('dotenv').config();


const io = require('socket.io')();
const shortid = require('shortid');
const cookie = require('cookie');

const Game = require('./game');
const Server = require('./server');
const Namespace = require('./namespace');

const url = process.env.DEVURL;

const server = new Server();

const dao = require('./dao');

const {get, insert, update, connection, namespace, resume, socketID} = require('./constants');



io.on(connection, function(socket) {

    if (socket.handshake.headers.cookie && cookie.parse(socket.handshake.headers.cookie).id) {
        let sessionID = cookie.parse(socket.handshake.headers.cookie).id;
        dao.query(get, resume, sessionID, row => {
            if (row) {
                dao.query(update, socketID, socket.client.id, sessionID);
                let nsp = row.nspID;
                let displayName = row.displayName;
                socket.emit(resume, {namespace: nsp, displayName: displayName})
                //fix resume for greater flexibility
            }
        })

    }

    if (socket.handshake.query.code) {
        let nsp = socket.handshake.query.code;
        dao.query(get, namespace, nsp, row => {
            if (row) {
                socket.emit(namespace, {namespace: nsp})
            } else {
                socket.emit(namespace, false)
            }
        })
    }

    socket.on(namespace, msg => {
        if (msg) {
            dao.query(get, namespace, msg, row => {
                if (row) {
                    socket.emit(namespace, true)
                } else {
                    socket.emit(namespace, false)
                }
            })
        } else {
            let nsp = shortid.generate();
            dao.query(insert, namespace, nsp, () => {
                new Namespace(io, nsp, socket);
                socket.emit(namespace, {namespace: nsp})
            })
        }
    })

});

const port = 5000;
io.listen(port);
console.log('Listening on port', port);