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

        let sql = `SELECT nsp_id nspID FROM namespaces WHERE nsp_id = ?`
        let params = [namespace]

        dao.get(sql, params, row => {
            if (row) {
                socket.emit('namespace', {namespace: namespace})
            } else {
                socket.emit('namespace', false)
            }
        })
    }

    socket.on('namespace', namespace => {
        if (namespace) {
            console.log("Hiya!")

            let sql = `SELECT nsp_id nspID FROM namespaces WHERE nsp_id = ?`
            let params = [namespace]

            dao.get(sql, params, row => {
                if (row) {
                    socket.emit('namespace', true)
                } else {
                    socket.emit('namespace', false)
                }
            })

        } else {
            let namespace = shortid.generate()
            server.namespaces[namespace] = new Namespace(io, namespace, socket)

            let sql = `INSERT INTO namespaces(nsp_id) VALUES (?)`
            let params = [namespace]
            dao.insert(sql, params, () => socket.emit('namespace', {namespace: namespace}))

        }
    })

    socket.on('cookie', namespace => {
        let sessionID = shortid.generate()
        let sql = `INSERT INTO sessions(session_id, nsp_id) VALUES (?, ?);`
        let params = [sessionID, namespace]
        dao.insert(sql, params, () => socket.emit('cookie', "id=" + sessionID))
    })

})

const port = 5000;
io.listen(port);
console.log('Listening on port', port);