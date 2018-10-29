const Player = require('./player')
const Game = require('./game')

const shortid = require('shortid')
const cookie = require('cookie')
const nodemailer = require('nodemailer')

const server = require('./main')
const dao = require('./dao')

module.exports = class Namespace {

    constructor(io, namespace) {

        this.players = []
        this.chat = []
        this.total = 0
        this.games = []
        this.address = namespace

        this.namespace = io.of("/" + namespace)

        this.namespace.on('connection', this.setListeners.bind(this))

    }

    setListeners(socket) {

        //do i still need this?
        socket.on('cookie', () => {
            let sessionID = shortid.generate()

            let sql = `INSERT INTO sessions(session_id, nsp_id) VALUES (?, ?);`
            let params = [sessionID, this.address]

            dao.insert(sql, params, () => socket.emit('cookie', "id=" + sessionID))
        })

        socket.on('players', req => {
            if (req) {
                let sql =
                    `UPDATE sessions
                    SET display_name = ?, socket_id = ?
                    WHERE session_id = ?`

                let params = [req.name, socket.client.id, cookie.parse(req.cookie).id]

                dao.update(sql, params)

                this.players.push(new Player(req.name, cookie.parse(req.cookie).id, socket.client.id))

            } else {
                this.total++
            }
            let sql =
                `SELECT display_name name,
                        socket_id socketID,
                        session_id sessionID
                FROM sessions
                WHERE nsp_id = ? AND display_name IS NOT NULL
                ORDER BY display_name;`
            let params = [this.address]
            dao.db.all(sql, params, (err, rows) => {
                if (err) {
                    console.error(err.message)
                } else {
                    let selectSQL =
                        `SELECT count(*) count
                        FROM sessions
                        WHERE nsp_id = ? AND display_name IS NULL`
                    let selectParams = [this.address]
                    dao.db.get(selectSQL, selectParams, (err, row) => {
                        if (err) {
                            console.error(err.message)
                        } else {
                            //make it so the front end just uses row.count
                            this.namespace.emit('players', {players: rows, total: rows.length + row.count})
                        }
                    })
                }
            })
        })

        socket.on('message', message => {
            if (message) {
                this.chat.push(message)
            }
            this.namespace.emit('message', this.chat)

            //add chat table
        })

        socket.on('ready', () => {

            //SQL query player
            let player = this.findPlayer('socketID', socket.client.id)

            //add ready boolean field to table
            if (player != null) {
                this.players[player].ready = true
            }

            //check if any players are false in nsp
            if (this.players.length === this.total) {
                if (this.checkReady()) {
                    this.namespace.emit('ready')
                    // this.games.push(new Game(this.players))
                }
            }
        })

        socket.on('select', (team) => {

            //add team category, update player
            if (team) {
                let player = this.findPlayer('socketID', socket.client.id)
                if (player != null) {
                    this.players[player].team = (team !== 'unsorted') ? team : null
                }
            }
            //get all players in nsp
            this.namespace.emit('players', {players: this.players})
        })

        socket.on('disconnect', () => {
            let sql=
                `UPDATE sessions
                SET socket_id = ?
                WHERE socket_id = ?`

            let params = [null, socket.client.id]

            dao.update(sql, params)

            let player = this.findPlayer('socketID', socket.client.id)
            if (player != null) {
                this.players[player].socketID = null
            }
            this.total--
        })

        // socket.on('email', () => {
        //     socket.on('sendcode', function(msg){
        //         let link = `${url}/?code=${msg.code}`
        //         let transporter = nodemailer.createTransport({
        //             service: 'gmail',
        //             auth: {
        //                 user: process.env.EMAIL,
        //                 pass: process.env.EMAIL_PW
        //             },
        //             tls: {
        //                 rejectUnauthorized: false
        //             }
        //         });
        //
        //         let mailOptions = {
        //             to: ...invites,
        //             subject: "You've been invited to play a game of The Fox in the Forest!",
        //             text: `Go to http://fox-forest.alasdairwilkins.com and enter ${msg.code} when it asks for a game code.`,
        //             html: `Go to <a href="${url}?code=${msg.code}">fox-forest.alasdairwilkins.com</a> and enter ${msg.code} when it asks for a game code. Good luck!`
        //             //         };
        //             //
        //             //         transporter.sendMail(mailOptions, (error, info) => {
        //             //             if (error) {
        //             //                 return console.log(error);
        //             //             }
        //             //
        //             //         });
        // })
    }

    findPlayer(key, value) {
        for (let i in this.players) {
            if (this.players[i][key] === value) {
                return i
            }
        }
        return null
    }

    checkReady() {
        for (let i in this.players) {
            console.log(this.players[i])
            if (!this.players[i].ready) {
                return false
            }
        }
        return true
    }

}