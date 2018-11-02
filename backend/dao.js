const sqlite3 = require('sqlite3').verbose();

const dbFilePath = './db/sqlite.db';

const sql = require('./sql')

const {update, insert, get, all, namespace, session, message} = require('./constants')

class DAO {
    constructor(dbFilePath) {

        this.updateMultiple = this.updateMultiple.bind(this)

        this.db = new sqlite3.Database(dbFilePath, err => {
            if (err) {
                console.error(err.message)
            } else {
                console.log("Connected to the database.")
            }
        });

        this.db.serialize(() => {
            for (let table in sql.drop) {
                this.db.run(sql.drop[table])
            }

            for (let table in sql.create) {
                this.db.run(sql.create[table])
            }
        })
    }

    query() {
        let type = arguments[0];
        let header = arguments[1];

        let hasCB = (typeof arguments[arguments.length - 1] === "function");



        // if (typeof sql[type][header] === 'function') {
        //     let headerOriginal = arguments[2]
        //     let paramsOriginal = arguments[3]
        //     let sqlUpdate = sql[type][header](headerOriginal, paramsOriginal)
        //
        //
        //     let paramsUpdate = paramsOriginal.map(param => param.team + "," + param.socketID).join(",")
        //     console.log(sqlUpdate, paramsUpdate)
        //     this.db.run(sqlUpdate, paramsUpdate, err => {
        //         if (err) {
        //             console.error(err.message)
        //         } else {
        //             console.log("Success!")
        //         }
        //     })
        //
        // } else {
            let params = [];
            for (let i = 2; (hasCB) ? i < arguments.length - 1 : i < arguments.length; i++) {
                params.push(arguments[i])
            }
            let cb = (hasCB) ? arguments[arguments.length - 1] : null;
            this[type](header, params, cb)
        // }


    }

    insert(header, params, cb) {

        this.db.run(sql[insert][header], params, function (err) {
            if (err) {
                console.error("Insert error:", err.message)
            } else {
                cb()
            }
        })
    }

    update(header, params, cb) {

        this.db.run(sql[update][header], params, function(err) {
            if (err) {
                console.error("Update error", err.message)
            } else {
                if (cb) {
                    cb()
                }
            }
        })
    }

    updateMultiple(header, params, cb) {

        console.log(this)

        this.db.run(sql[update][header], params[0], (err) => {
            if (err) {
                console.error("Update error", err.message)
            } else {
                if (params.length > 1) {
                    this.updateMultiple(header, params.slice(1), cb)
                } else {
                    cb()
                }
            }
        })

    }

    get(header, params, cb) {

        this.db.get(sql[get][header], params, function(err, row) {
            if (err) {
                console.error("Get error:", err.message, sql[get][header])
            } else {
                cb(row)
            }
        })
    }

    all(header, params, cb) {

        this.db.all(sql[all][header], params, function(err, rows) {
            if (err) {
                console.error("All error:", err.message)
            } else {
                cb(rows)
            }
        })
    }
}

module.exports = new DAO(dbFilePath);