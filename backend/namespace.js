const Player = require('./player')
const Game = require('./game')

const shortid = require('shortid')
const cookie = require('cookie')
const nodemailer = require('nodemailer')

const server = require('./main')
const dao = require('./dao')

module.exports = class Namespace {

    constructor(io, namespace) {

        this.chat = []
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

            let sql = `
            UPDATE sessions
            SET ready = 1
            WHERE socket_id = ?
            `

            let params = [socket.client.id]

            dao.update(sql, params, () => {
                let getSQL = `
                SELECT COUNT(*) count
                FROM sessions
                WHERE nsp_id = (?) AND ready = 0
                `

                let getParams = [this.address]

                dao.get(getSQL, getParams, (row) => {
                    if (!row.count) {
                        this.namespace.emit('ready')
                    }
                })
            })

        })

        socket.on('select', (team) => {

            let sql = `
            UPDATE sessions
            SET team = (?)
            WHERE socket_id = (?)
            `

            let params = [team, socket.client.id]

            dao.update(sql, params, () => {
                let allSql =
                    `SELECT display_name name,
                        socket_id socketID,
                        team
                    FROM sessions
                    WHERE nsp_id = ?
                    ORDER BY display_name;`
                let allParams = [this.address]
                dao.db.all(allSql, allParams, (err, rows) => {
                    this.namespace.emit('players', {players: rows})
                })
            })
        })

        socket.on('disconnect', () => {
            let sql=
                `UPDATE sessions
                SET socket_id = ?
                WHERE socket_id = ?`

            let params = [null, socket.client.id]

            dao.update(sql, params)
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

}