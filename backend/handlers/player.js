const dao = require('../dao');

const updatePlayerTeamSelect = function(team, clientID, callback) {
    dao.query('players', 'update', 'team', team, clientID, (err) => {
        callback()
    })
};

const getAllPlayersTeamSelect = function(nspID, callback) {
    dao.query('players', 'all', 'team', nspID, (err, rows) => {
        dao.query('players', 'get', 'checkPlayerMax', nspID, (err, row) => {
            let max = Math.ceil(row.total / 2);
            let blueMax = (row.blueCount >= max);
            let redMax = (row.redCount >= max);
            callback(rows, blueMax, redMax)
        })
    })
};

const getUnsortedPlayers = function(nspID, callback) {
    dao.query('players', 'all', 'unsorted', nspID, (err, players) => {
        dao.query('players', 'get', 'checkPlayerMax', nspID, (err, count) => {
            callback(players, count)
        })
    })
};

const getTeams = function(clientID, callback) {
    dao.query('players', 'get', 'team', clientID, (err, result) => {
        callback(result, result.team)
    })
}

const getTeamAndCodemaster = function(clientID, nspID, callback) {
    dao.query('players', 'get', 'teamAndCodemaster', clientID, nspID, (err, result) => {
        console.log(result)
        callback(result.team, !!(result.codemaster))
    })
}

module.exports =
    {updatePlayerTeamSelect, getAllPlayersTeamSelect, getUnsortedPlayers, getTeams, getTeamAndCodemaster};
