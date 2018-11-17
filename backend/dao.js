const sqlite3 = require('sqlite3').verbose();

const dbFilePath = './db/sqlite.db';

const sql = require('./sql/')

const {update, insert, get, all, run, namespace, session, message} = require('./constants');

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
            for (let table in sql) {
                this.db.run(sql[table].drop)
                this.db.run(sql[table].create)
                console.log("Success!")
            }
        })
    }

    query() {

        let table = arguments[0]
        let type = arguments[1];
        let header = arguments[2];
        let op = this.getOp(type);
        let hasCB = (typeof arguments[arguments.length - 1] === "function");
        let cb = (hasCB) ? arguments[arguments.length - 1] : null;

        // let [isMultiple, originalParams, paramsLength] = (typeof sql[type][header] === 'function') ?
        //     [true, arguments[3], 4] : [false, null, 3]
        let paramsLength = 3


        let params = [];

        if ((hasCB) && arguments.length > paramsLength + 1 || (!hasCB) && arguments.length > paramsLength) {
            for (let i = paramsLength; (hasCB) ? i < arguments.length - 1 : i < arguments.length; i++) {
                if (arguments[i] && typeof arguments[i] === 'object') {
                    params.push(...Object.values(arguments[i]))
                } else {
                    params.push(arguments[i])
                }
            }
        }

        let query = (header) ? sql[table][type][header] : sql[table][type]
        // if (isMultiple) {
        //     let [newHeader, newParams] = query(originalParams, ...params);
        //     let newQuery =
        //     this.multiple(op, type, newHeader, newParams, cb)
        // } else {
            this.run(op, query, params, cb)
        // }

    }


    // } else {
        //     let params = [];
        //     for (let i = 2; (hasCB) ? i < arguments.length - 1 : i < arguments.length; i++) {
        //         if (typeof arguments[i] === 'object') {
        //             params.push(...Object.values(arguments[i]))
        //         } else {
        //             params.push(arguments[i])
        //         }
        //     }



    run(op, query, params, cb) {

        this.db[op](query, params, function (err, res) {
            if (err) {
                console.error("Error:", err.message)
            } else {
                if (cb) {
                    cb(res)
                }
            }
        })

    }

    multiple(op, query, params, cb, result) {

        this.db[op](query, params[0], (err, res) => {
            if (err) {
                console.error("Error", err.message)
            } else {
                if (params.length > 1) {
                    this.multiple(op, query, params.slice(1), cb)
                } else {
                    if (cb) {
                        cb(res)
                    }
                }
            }
        })

        //db.run( sql query , [params], callback)
    }

    getOp(type) {
        switch (type) {
            case get:
                return get;
            case all:
                return all;
            default:
                return run
        }
    }

}

module.exports = new DAO(dbFilePath);