const Promise = require('bluebird')

const dao = Promise.promisifyAll(require('../dao'));
const shortid = require('shortid');

const joinNamespace = function(namespace, callback) {
    dao.query('namespaces', 'get', 'namespace', namespace, (err, row) => {
        if (row) {
            callback(true)
        } else {
            callback(false)
        }
    })
};

const createNamespace = function(callback) {
    let nsp = shortid.generate();
    dao.query('namespaces', 'insert', nsp, (err) => {
        dao.query('namespaces', 'get', 'namespace', nsp, (err, row) => {
            if (row) {
                callback(row.nspID)
            } else {
                callback(false)
            }
        })
    })
};

module.exports = {joinNamespace, createNamespace};