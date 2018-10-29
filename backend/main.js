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

io.on('connection', function(socket) {

    if (socket.handshake.headers.cookie && cookie.parse(socket.handshake.headers.cookie).id) {
        let sessionID = cookie.parse(socket.handshake.headers.cookie).id;

        let params = [sessionID];

        dao.get('resume', params, row => {
            if (row) {

                let params = [socket.client.id, sessionID];

                dao.update('socketID', params);

                let namespace = row.nspID;
                let displayName = row.displayName;

                socket.emit('resume', {namespace: namespace, displayName: displayName})
            }
        })

    }

    if (socket.handshake.query.code) {
        let namespace = socket.handshake.query.code;
        let params = [namespace];

        dao.get('namespace', params, row => {
            if (row) {
                socket.emit('namespace', {namespace: namespace})
            } else {
                socket.emit('namespace', false)
            }
        })
    }

    socket.on('namespace', namespace => {
        if (namespace) {


            let params = [namespace];

            dao.get('namespace', params, row => {
                if (row) {
                    socket.emit('namespace', true)
                } else {
                    socket.emit('namespace', false)
                }
            })

        } else {
            let namespace = shortid.generate();
            let params = [namespace];
            dao.insert('namespace', params, () => {
                new Namespace(io, namespace, socket);
                socket.emit('namespace', {namespace: namespace})
            })

        }
    })

});

const port = 5000;
io.listen(port);
console.log('Listening on port', port);