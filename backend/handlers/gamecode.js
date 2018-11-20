const dao = require('../dao');

const gamecode = function(code, callback) {
    dao.query('namespaces', 'get', 'namespace', code, (err, row) => {
        if (row) {
            callback({namespace: row.nspID})
        } else {
            callback(false)
        }
    })
};

module.exports = {gamecode};