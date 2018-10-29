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

        dao.query('get', 'resume', params, row => {
            if (row) {
                dao.query('update', 'socketID', socket.client.id, sessionID);
                let namespace = row.nspID;
                let displayName = row.displayName;
                socket.emit('resume', {namespace: namespace, displayName: displayName})
            }
        })

    }

    if (socket.handshake.query.code) {
        let namespace = socket.handshake.query.code;
        dao.query('get', 'namespace', namespace, row => {
            if (row) {
                socket.emit('namespace', {namespace: namespace})
            } else {
                socket.emit('namespace', false)
            }
        })
    }

    socket.on('namespace', namespace => {
        if (namespace) {
            dao.query('get', 'namespace', namespace, row => {
                if (row) {
                    socket.emit('namespace', true)
                } else {
                    socket.emit('namespace', false)
                }
            })
        } else {
            let namespace = shortid.generate();
            dao.query('insert', 'namespace', namespace, () => {
                new Namespace(io, namespace, socket);
                socket.emit('namespace', {namespace: namespace})
            })
        }
    })

});

const port = 5000;
io.listen(port);
console.log('Listening on port', port);