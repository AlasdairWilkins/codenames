const dao = require('../dao');

const setReady = function(header, clientID, callback) {
    dao.query(header, 'update', 'ready', clientID, () => {
        callback()
    })
};

const checkAllReady = function(header, nspID, callback) {
    dao.query(header, 'get', 'ready', nspID, row => {
        callback(row.count)
    })
};

module.exports = {setReady, checkAllReady};