const dao = require('../dao');

const updatePlayerTeamSelect = function(team, clientID, callback) {
    dao.query('players', 'update', 'team', team, clientID, () => {
        callback()
    })
};

const getAllPlayersTeamSelect = function(nspID, callback) {
    dao.query('players', 'all', 'team', nspID, rows => {
        dao.query('players', 'get', 'checkPlayerMax', nspID, row => {
            let max = Math.ceil(row.total / 2);
            let blueMax = (row.blueCount >= max);
            let redMax = (row.redCount >= max);
            callback(rows, blueMax, redMax)
        })
    })
};

const getUnsortedPlayers = function(nspID, callback) {
    dao.query('players', 'all', 'unsorted', this.address, players => {
        dao.query('players', 'get', 'checkPlayerMax', this.address, count => {
            callback(players, count)
        })
    })
};

const getTeams = function(clientID, callback) {
    dao.query('players', 'get', 'team', clientID, (result) => {
        callback(result, result.team)
    })
}

module.exports =
    {updatePlayerTeamSelect, getAllPlayersTeamSelect, getUnsortedPlayers, getTeams};
