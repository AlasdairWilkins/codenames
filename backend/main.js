require('dotenv').config();


const io = require('socket.io')();
const shortid = require('shortid');
const cookie = require('cookie');

const Namespace = require('./namespace');

const url = process.env.DEVURL;

const dao = require('./dao');

const {get, insert, update, connection, namespace, resume, socketID} = require('./constants');



io.on(connection, function(socket) {

    if (socket.handshake.headers.cookie && cookie.parse(socket.handshake.headers.cookie).id) {
        let sessionID = cookie.parse(socket.handshake.headers.cookie).id;

        dao.query(get, 'display', sessionID, (result) => {
            if (result) {
                switch (result.display) {

                    case 'waiting':
                        console.log("Get waiting resume")
                        break

                    case 'select':
                        console.log("Get select resume")
                        break

                    case 'game':
                        console.log("Get game resume")
                        break

                    default:
                        console.log(result)

                }
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