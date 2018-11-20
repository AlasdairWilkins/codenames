const {create, text, bool, primary, foreign} = require('./templates');

const players = {
    create: create('players', text('game_id'), text('nsp_id').notNull(), text('session_id'), text('socket_id'),
        text('display_name'), text('team').default(null).checkIn(null, 'blue', 'red'), bool('codemaster', false),
        bool('ready', false), primary('game_id', 'session_id'), foreign('nsp_id', 'namespaces'),
        foreign('game_id', 'games'), foreign('session_id', 'sessions'),
        foreign('socket_id', 'sessions').onUpdate('CASCADE')),

    insert: `INSERT INTO players(game_id, session_id, nsp_id, socket_id, display_name)
                    SELECT (?), session_id, nsp_id, socket_id, display_name
                    FROM sessions WHERE nsp_id = (?)`,
    update: {
        ready: `UPDATE players SET ready = 1 WHERE socket_id = ?`,
        codemaster: `UPDATE players SET codemaster = ? WHERE session_id = ?`,
        team: `UPDATE players SET team = (?) WHERE socket_id = (?);`,
        teams: (params) => [`UPDATE players SET team = (?) WHERE socket_id = (?);`,
            params.map(param => [param.team, param.socketID])],
    },
    get: {
        ready: `SELECT count(*) count FROM players WHERE 
            game_id IN (SELECT game_id FROM namespaces WHERE nsp_id = (?)) AND ready = 0`,
        team: `SELECT team FROM players WHERE socket_id = ?`,
        checkPlayerMax:
            `SELECT count(*) total,
                sum(case when team = 'blue' then 1 else 0 end) blueCount,
                sum(case when team = 'red' then 1 else 0 end) redCount
                FROM players WHERE nsp_id = (?)`,
    },
    all: {
        team: `SELECT display_name name,
                        socket_id socketID,
                        team
                    FROM players WHERE nsp_id = (?)
                    ORDER BY display_name;`,
        unsorted: `SELECT display_name name,
                        socket_id socketID,
                        team
                    FROM players
                    WHERE game_id = (SELECT game_id FROM namespaces WHERE nsp_id = (?)) AND team IS NULL
                    ORDER BY display_name;`,
        teamColor: `SELECT session_id sessionID
                    FROM players
                    WHERE team = (?) AND game_id = (SELECT game_id FROM namespaces WHERE nsp_id = (?));`
    }

};

module.exports = players;