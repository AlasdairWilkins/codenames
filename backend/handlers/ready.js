const dao = require('../dao');
const shortid = require('shortid');
const game = require('../game')

const setReady = function(header, clientID, nspID) {
    return new Promise((resolve, reject) => {
        dao.query(header, 'update', 'ready', clientID)
            .then(() => {
                return checkAllReady(header, nspID)
            })
            .then(count => {
                resolve(count)
            })
            .catch(err => {
                reject(err)
            })
    })
};

const setWaitingReady = function(clientID, nspID) {
    return new Promise((resolve, reject) => {
        setReady('sessions', clientID, nspID)
            .then(count => {
                if (!count) {
                    return createGameInstance(nspID)
                } else {
                    return false
                }
            })
            .then(result => {
                resolve(result)
            })
            .catch(err => {
                reject(err)
            })
    })
}

const createGameInstance = function(nspID) {
    let gameID = shortid.generate()
    return Promise.all([dao.query('games', 'insert', gameID, nspID),
        dao.query('players', 'insert', gameID, nspID), dao.query('namespaces', 'update', 'select', nspID)])
        .then(() => {
            return true
        })
        .catch(err => {
            console.error(err.message)
        })
};

const checkAllReady = function(header, nspID) {
    return new Promise((resolve, reject) => {
        dao.query(header, 'get', 'ready', nspID)
            .then(count => {
                resolve(count)
            })
            .catch(err => {
                reject(err)
            })
    })
};

const setSelectReady = function(clientID, nspID) {
    return new Promise((resolve, reject) => {
        setReady('players', clientID, nspID)
            .then(count => {
                if (!count) {
                    return buildGame(nspID)
                } else {
                    return false
                }
            })
            .then(result => {
                console.log("After", result)
                resolve(result)
            })
            .catch(err => {
                reject(err)
            })
    })
}

const buildGame = function(nspID) {
    return Promise.all([makeTeams(nspID), makeBoard(nspID)])
        .then(() => {
            let result = true
            return Promise.resolve(result)
        })
        .catch(err => {
            return Promise.reject(err)
        })
}

const makeTeams = function(nspID) {
    return Promise.all(
        [dao.query('players', 'all', 'unsorted', nspID), dao.query('players', 'get', 'checkPlayerMax', nspID)])
        .then(([players, count]) => {
            let sorted = game.makeTeams(players, count);
            return dao.query('players', 'update', 'teams', sorted)
        })
        .then(() => {
            return setCodemasters(nspID)
        })
        .then(() => {
            Promise.resolve()
        })
        .catch(err => {
            Promise.reject(err)
        })
};

const makeBoard = function(nspID) {
    let [board, first] = game.makeBoard(25);
    return Promise.all(
        [dao.query('words', 'insert', 'words', board, nspID), dao.query('games', 'update', 'turn', first, nspID),
            dao.query('namespaces', 'update', 'game', nspID)])
        .then(() => {
            return Promise.resolve()
        })
        .catch((err) => {
            return Promise.reject(err)
        })
}

const setCodemasters = function(nspID) {
    return Promise.all([setCodemaster(nspID, 'blue'), setCodemaster(nspID, 'red')])
        .then(() => {
            return Promise.resolve()
        })
        .catch(err => {
            return Promise.reject(err)
        })
}

const setCodemaster = function(nspID, color) {
    return new Promise((resolve, reject) => {
        dao.query('players', 'all', 'teamColor', color, nspID)
            .then(team => {
                if (team.length) {
                    let codemasterIndex = Math.floor(Math.random() * team.length)
                    return dao.query('players', 'update', 'codemaster', true, team[codemasterIndex])
                }
                return null
            })
            .then(() => {
                resolve()
            })
            .catch(err => {
                reject(err)
            })
    })
}

module.exports = {setWaitingReady, setSelectReady};