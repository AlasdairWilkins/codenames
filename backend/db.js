const sqlite3 = require('sqlite3').verbose()

module.exports = new sqlite3.Database('./db/sqlite.db', err => {
    if (err) {
        console.error(err.message)
    } else {
        console.log("Connected to the database.")
    }
})