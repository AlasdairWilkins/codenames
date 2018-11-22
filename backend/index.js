require('dotenv').config();

const io = require('socket.io')();
const cookie = require('cookie');

const url = process.env.DEVURL;

const Namespace = require('./namespace');

const handle = require('./handlers');

const {get, insert, update, connection, namespace, resume, socketID} = require('./constants');



io.on(connection, function(socket) {

    // if (socket.handshake.headers.cookie && cookie.parse(socket.handshake.headers.cookie).id) {
    //     handle.resume(cookie.parse(socket.handshake.headers.cookie).id, result => {
    //         socket.emit(resume)
    //     })
    // }
    //
    // if (socket.handshake.query.code) {
    //     handle.gamecode(socket.handshake.query.code, result => {
    //         socket.emit(namespace, result)
    //     })
    // }

    socket.on(namespace, msg => {
        if (msg) {
            handle.joinNamespace(msg, result => {
                socket.emit(namespace, result)
            })
        } else {
            handle.createNamespace()
                .then(function(namespace) {
                    new Namespace(io, namespace, socket);
                    socket.emit('namespace', namespace)
                })
                .catch(function(err) {
                    console.error(err.message)
                })
        }
    })

});

const port = 5000;
io.listen(port);
console.log('Listening on port', port);