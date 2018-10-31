const sqlite3 = require('sqlite3').verbose();

const dbFilePath = './db/sqlite.db';

const sql = require('./sql')

const {update, insert, get, all, namespace, session, message} = require('./constants')

class DAO {
    constructor(dbFilePath) {

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
        let params = [];
        for (let i = 2; (hasCB) ? i < arguments.length - 1 : i < arguments.length; i++) {
            params.push(arguments[i])
        }
        let cb = (hasCB) ? arguments[arguments.length - 1] : null;

        this[type](header, params, cb)

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