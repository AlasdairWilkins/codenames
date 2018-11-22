const sqlite3 = require('sqlite3').verbose();

const dbFilePath = './db/sqlite.db';

const sql = require('./sql/');

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
                this.db.run(sql.drop(table));
                this.db.run(sql[table].create)
            }
        })
    }

    query() {

        let table = arguments[0];
        let type = arguments[1];
        let header = arguments[2];

        let [query, hasHeader] = (typeof sql[table][type] === 'object') ?
            [sql[table][type][arguments[2]], true] : [sql[table][type], false];

        let paramsStart = (hasHeader) ? 3 : 2;

        let op = this.getOp(type);
        let hasCB = (typeof arguments[arguments.length - 1] === "function");
        let cb = (hasCB) ? arguments[arguments.length - 1] : null;

        let [isMultiple, originalParams] = (typeof query === 'function') ?
            [true, arguments[paramsStart]] : [false, null];

        if (isMultiple) {
            paramsStart++
        }

        let params = [];

        if ((hasCB) && paramsStart + 1 < arguments.length || (!hasCB) && paramsStart < arguments.length) {
            for (let i = paramsStart; (hasCB) ? i < arguments.length - 1 : i < arguments.length; i++) {
                if (arguments[i] && typeof arguments[i] === 'object') {
                    params.push(...Object.values(arguments[i]))
                } else {
                    params.push(arguments[i])
                }
            }
        }

        if (isMultiple) {
            let [newQuery, newParams] = query(originalParams, ...params);
            this.multiple(op, newQuery, newParams, cb)
        } else {
            return this.run(op, query, params, cb)
        }

    }


//prep for promises refactoring

    run(op, query, params, callback) {

        return new Promise((resolve, reject) => {
            console.log("Hiya", this, op, query, params, callback)
            this.db[op](query, params, function (err, res) {
                if (err) {
                    console.log("Error!", err)
                    reject(err)
                } else {
                    console.log("Got it!", res)
                    resolve(res)
                }
            })
        })
    }

    multiple(op, query, params, callback) {

        this.db[op](query, params[0], (err, res) => {
            if (params.length > 1) {
                this.multiple(op, query, params.slice(1), callback)
            } else {
                callback(err, res)
            }
        })

    }

    // run(op, query, params, callback) {
    //
    //     this.db[op](query, params, function (err, res) {
    //         if (err) {
    //             console.log(query, params);
    //             console.error("Error:", err.message)
    //         } else {
    //             if (cb) {
    //                 cb(res)
    //             }
    //         }
    //     })
    //
    // }
    //
    // multiple(op, query, params, cb, result) {
    //
    //     this.db[op](query, params[0], (err, res) => {
    //         if (err) {
    //             console.log(query, params);
    //             console.error("Error", err.message)
    //         } else {
    //             if (params.length > 1) {
    //                 this.multiple(op, query, params.slice(1), cb)
    //             } else {
    //                 if (cb) {
    //                     cb(res)
    //                 }
    //             }
    //         }
    //     })
    //
    //     //db.run( sql query , [params], callback)
    // }

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