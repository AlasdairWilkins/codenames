const sqlite3 = require('sqlite3').verbose();

const dbFilePath = './db/sqlite.db';

const sql = require('./sql');

const {update, insert, get, all, namespace, session, message} = require('./constants');

class DAO {
    constructor(dbFilePath) {

        this.multiple = this.multiple.bind(this);

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
        let op = this.getOp(type);

        let hasCB = (typeof arguments[arguments.length - 1] === "function");
        let cb = (hasCB) ? arguments[arguments.length - 1] : null;

        if (typeof sql[type][header] === 'function') {

            let params = arguments[2];
            let additional = [];
            if ((hasCB) && arguments.length > 4 || (!hasCB) && arguments.length > 3) {
                for (let i = 3; (hasCB) ? i < arguments.length - 1 : i < arguments.length; i++) {
                    additional.push(arguments[i])
                }
            }
            let [newHeader, newParams] = sql[type][header](params, ...additional);

            this.multiple(op, type, newHeader, newParams, cb)

        } else {
            let params = [];
            for (let i = 2; (hasCB) ? i < arguments.length - 1 : i < arguments.length; i++) {
                params.push(arguments[i])
            }
            this.run(op, type, header, params, cb)
        }


    }

    run(op, type, header, params, cb) {

        this.db[op](sql[type][header], params, function (err, res) {
            if (err) {
                console.error("Error:", err.message)
            } else {
                if (cb) {
                    cb(res)
                }
            }
        })

    }

    multiple(op, type, header, params, cb) {

        this.db[op](sql[type][header], params[0], (err, res) => {
            if (err) {
                console.error("Error", err.message)
            } else {
                if (params.length > 1) {
                    this.multiple(op, type, header, params.slice(1), cb)
                } else {
                    if (cb) {
                        cb(rs)
                    }
                }
            }
        })
    }

    getOp(type) {
        switch (type) {
            case get:
                return get;
            case all:
                return all;
            default:
                return 'run'
        }
    }
    
}

module.exports = new DAO(dbFilePath);