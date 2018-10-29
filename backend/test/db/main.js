const sqlite3 = require('sqlite3').verbose();
const Promise = require('bluebird');
const shortid = require('shortid');

const db = new sqlite3.Database('./test.db', err => {
    if (err) {
        console.error(err.message)
    } else {
        console.log("Connected to the test database.")
    }
});

let sql =
    `CREATE TABLE IF NOT EXISTS sessions (
        session_id   TEXT PRIMARY KEY,
        namespace   TEXT
    );`;

db.run(sql);

let insertSQL =
    `INSERT INTO sessions(session_id, namespace) VALUES(?, ?)`;

let cookie = shortid.generate();

let namespace = shortid.generate();

let selectSQL =
    `SELECT namespace FROM sessions WHERE session_id = ?`;



let insertParams = [cookie, namespace];
console.log("To be inserted:", insertParams);
let selectParams = [cookie];
console.log("To be selected:", selectParams);

db.serialize(function() {
    db.run(insertSQL, insertParams, function(err) {
        if (err) {
            console.error("Insert error:", err.message)

        } else {
            console.log("Success:", this)
        }
    });

    db.get(selectSQL, selectParams, function(err, row) {
        console.log(row)
    })
});




db.close();