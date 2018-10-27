require('dotenv').config()


const io = require('socket.io')();
const shortid = require('shortid')
const cookie = require('cookie')

const Game = require('./game')
const Server = require('./server')
const Namespace = require('./namespace')

const url = process.env.DEVURL

const server = new Server()

const dao = require('./dao')

io.on('connection', function(socket) {

    if (socket.handshake.headers.cookie && cookie.parse(socket.handshake.headers.cookie).id) {
        let sessionID = cookie.parse(socket.handshake.headers.cookie).id

        let sql =
            `SELECT nsp_id nspID, display_name displayName FROM sessions WHERE session_id = ?`

        let params = [sessionID]

        dao.get(sql, params, row => {
            console.log(row)
            if (row) {
                let sql =
                    `UPDATE sessions
                    SET socket_id = ?
                    WHERE session_id = ?`

                let params = [socket.client.id, sessionID]

                dao.update(sql, params)

                let namespace = row.nspID
                let displayName = row.displayName

                socket.emit('resume', {namespace: namespace, displayName: displayName})
            }
        })

    }

    if (socket.handshake.query.code) {
        let namespace = socket.handshake.query.code
        if (server.namespaces[namespace]) {
            socket.emit('namespace', {namespace: namespace})
        } else {
            console.log("whoops")
        }
    }

    socket.on('namespace', namespace => {
        if (namespace) {
            if (server.namespaces[namespace]) {
                socket.emit('namespace', true)
            }
            socket.emit('namespace', false)
        } else {
            let namespace = shortid.generate()
            server.namespaces[namespace] = new Namespace(io, namespace, socket)
            socket.emit('namespace', {namespace: namespace})
        }
    })

    socket.on('cookie', namespace => {
        let sessionID = shortid.generate()
        let table = `sessions(session_id, nsp_id)`
        let params = [sessionID, namespace]
        dao.insert(table, params, () => socket.emit('cookie', "id=" + sessionID))
    })

})

const port = 5000;
io.listen(port);
console.log('Listening on port', port);