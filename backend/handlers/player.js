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
    dao.query('players', 'all', 'unsorted', this.address, (err, players) => {
        dao.query('players', 'get', 'checkPlayerMax', this.address, (err, count) => {
            callback(players, count)
        })
    })
};

const getTeams = function(clientID, callback) {
    dao.query('players', 'get', 'team', clientID, (err, result) => {
        callback(result, result.team)
    })
}

module.exports =
    {updatePlayerTeamSelect, getAllPlayersTeamSelect, getUnsortedPlayers, getTeams};
