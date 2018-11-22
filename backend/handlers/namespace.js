const Promise = require('bluebird')

const dao = require('../dao');
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

const createNamespace = function() {
    let nspID = shortid.generate();
    return new Promise((resolve, reject) => {
        dao.query('namespaces', 'insert', nspID)
            .then(function() {
                return dao.query('namespaces', 'get', 'namespace', nspID)
            })
            .then(function(result) {
                resolve(result.nspID)
            })
            .catch(function(err) {
                reject(err)
            })

    })




    //     (err) => {
    //      (err, row) => {
    //         if (row) {
    //             callback(row.nspID)
    //         } else {
    //             callback(false)
    //         }
    //     })
    // })
};

module.exports = {joinNamespace, createNamespace};