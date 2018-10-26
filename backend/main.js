require('dotenv').config()


const io = require('socket.io')();
const shortid = require('shortid')
const cookie = require('cookie')

const Game = require('./game')
const Server = require('./server')
const Namespace = require('./namespace')

const url = process.env.DEVURL

const server = new Server()

const db = require('./db')

let sql =
    `CREATE TABLE IF NOT EXISTS sessions (
        session_id   TEXT PRIMARY KEY,
        namespace   TEXT
    );`

db.run(sql)

io.on('connection', function(socket) {

    if (socket.handshake.headers.cookie && cookie.parse(socket.handshake.headers.cookie).id) {
        let sessionID = cookie.parse(socket.handshake.headers.cookie).id

        let sql =
            `SELECT namespace FROM sessions WHERE session_id = ?`

        let params = [sessionID]

        db.get(sql, params, function(err, row) {
            if (err) {
                console.log("Select error:", err)
            } else {
                let namespace = row.namespace
                if (server.namespaces[namespace]) {
                    let i = server.namespaces[namespace].findPlayer('cookie', sessionID)
                    let player = null
                    if (i) {
                        server.namespaces[namespace].players[i].socketID = socket.client.id
                        player = server.namespaces[namespace].players[i]
                    }
                    socket.emit('resume', {namespace: namespace, player: player})
                }
            }
        })

        // if (server.cookies[idCookie]) {
        //     let namespace = server.cookies[idCookie]
        //     let i = server.namespaces[namespace].findPlayer('cookie', idCookie)
        //     console.log(server.namespaces[namespace])
        //     let player = null
        //     if (i) {
        //         server.namespaces[namespace].players[i].socketID = socket.client.id
        //         player = server.namespaces[namespace].players[i]
        //     }
        //     socket.emit('resume', {namespace: namespace, player: player})
        // }
    }

    if (socket.handshake.query.code) {
        let gameCode = socket.handshake.query.code
        if (server.namespaces[gameCode]) {
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


        let sql =
            `INSERT INTO sessions(session_id, namespace) VALUES(?, ?)`

        let params = [sessionID, namespace]

        db.run(sql, params, function(err) {
            if (err) {
                console.error("Insert error:", err.message)

            } else {
                console.log("Success!")
                socket.emit('cookie', "id=" + sessionID)
            }
        })


        // server.cookies[newCookie] = namespace

    })

    // socket.on('recover')

})

const port = 5000;
io.listen(port);
console.log('Listening on port', port);