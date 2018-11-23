const Promise = require('bluebird')

const dao = require('../dao');
const shortid = require('shortid');

const getNamespace = function(nspID) {
    return new Promise((resolve, reject) => {
        dao.query('namespaces', 'get', 'namespace', nspID)
            .then(function(result) {
                resolve(result)
            })
            .catch(function(err) {
                reject(err)
            })
    })
};

const createNamespace = function() {
    let nspID = shortid.generate();
    return new Promise((resolve, reject) => {
        dao.query('namespaces', 'insert', nspID)
            .then(function() {
                return getNamespace(nspID)
            })
            .then(function(result) {
                resolve(result)
            })
            .catch(function(err) {
                reject(err)
            })

    })
};

module.exports = {getNamespace, createNamespace};