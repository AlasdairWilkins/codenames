const dao = require('../dao');

const updatePlayerTeamSelect = function(team, clientID, nspID) {
    return new Promise((resolve, reject) => {
        dao.query('players', 'update', 'team', team, clientID)
            .then(() => {
                return getAllPlayersTeamSelect(nspID)
            })
            .then(values => {
                resolve(values)
            })
            .catch(err => {
                console.error(err.message)
            })
        })
};

const getAllPlayersTeamSelect = function(nspID) {
    console.log(nspID);
    return Promise.all([dao.query('players', 'all', 'team', nspID),
        dao.query('players', 'get', 'checkPlayerMax', nspID)])
        .then(([players, row]) => {
            console.log("Result", players, row);
            let max = Math.ceil(row.total / 2);
            let blueMax = (row.blueCount >= max);
            let redMax = (row.redCount >= max);
            return {players, blueMax, redMax}
        })
        .catch(err => {
            console.error(err.message)
        })
};

const getTeams = function(clientID, callback) {
    dao.query('players', 'get', 'team', clientID, (err, result) => {
        callback(result, result.team)
    })
};

const getTeamAndCodemaster = function(clientID, nspID, callback) {
    dao.query('players', 'get', 'teamAndCodemaster', clientID, nspID, (err, result) => {
        console.log(result);
        callback(result.team, !!(result.codemaster))
    })
};

module.exports =
    {updatePlayerTeamSelect, getAllPlayersTeamSelect, getTeams, getTeamAndCodemaster};
