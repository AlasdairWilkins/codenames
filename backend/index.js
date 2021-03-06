require('dotenv').config();

const io = require('socket.io')();
const cookie = require('cookie');

const url = process.env.DEVURL;

const Namespace = require('./namespace');

const handle = require('./handlers');

const {connection} = require('./constants');



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

    socket.on('namespace/post', nspID => {
        console.log("Hey hey!");
        handle.getNamespace(nspID)
            .then(namespace => {
                socket.emit('namespace/post', namespace)
            })
            .catch(err => {
                console.error(err.message)
            })
    });

    socket.on('namespace/get', () => {
        console.log("Yo", socket.id);
        console.log("Ahoy hoy", socket.client.id);
        handle.createNamespace()
            .then(namespace => {
                new Namespace(io, namespace, socket);
                socket.emit('namespace/get', namespace)
            })
            .catch(err => {
                console.error(err.message)
            })
    })

});

const port = 5000;
io.listen(port);
console.log('Listening on port', port);