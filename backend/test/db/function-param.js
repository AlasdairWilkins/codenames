//
//
// let testObject = {
//     a: `hello`,
//     b: console.log
// }
//
// console.log(testObject.a, typeof testObject.a)
// console.log(testObject.b, typeof testObject.b)
// testObject.b(testObject.a)

const sqlite3 = require('sqlite3')

const db = new sqlite3.Database('./test.db', err => {
    if (err) {
        console.error(err.message)
    } else {
        console.log("Connected to the test database.")
    }
});
