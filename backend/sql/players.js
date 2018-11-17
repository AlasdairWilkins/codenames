const players = {
    drop: `DROP TABLE IF EXISTS players;`,
    create:  `CREATE TABLE IF NOT EXISTS players (
                game_id TEXT,
                nsp_id   TEXT    NOT NULL,
                session_id  TEXT,
                socket_id   TEXT,
                display_name    TEXT,
                team    TEXT    DEFAULT NULL    CHECK (team in (NULL, 'blue', 'red')),
                codemaster BOOLEAN DEFAULT 0 CHECK (codemaster in (0,1)),
                ready   BOOLEAN DEFAULT 0 CHECK (ready in (0,1)),
                    PRIMARY KEY (game_id,session_id),
                    FOREIGN KEY (nsp_id) REFERENCES namespaces(nsp_id)
                    FOREIGN KEY (game_id) REFERENCES games(game_id),
                    FOREIGN KEY (session_id) REFERENCES sessions(session_id),
                    FOREIGN KEY (socket_id) REFERENCES sessions(socket_id) ON UPDATE CASCADE
                );`,
    insert: `INSERT INTO players(game_id, session_id, nsp_id, socket_id, display_name)
                    SELECT (?), session_id, nsp_id, socket_id, display_name
                    FROM sessions WHERE nsp_id = (?)`,
    update: {
        selectReady: `UPDATE players SET ready = 1 WHERE socket_id = ?`,
        codemaster: `UPDATE players SET codemaster = ? WHERE socket_id = ?`,
        team: `UPDATE players SET team = (?) WHERE socket_id = (?);`,
        teams: (params) => [`UPDATE players SET team = (?) WHERE socket_id = (?);`,
            params.map(param => [param.team, param.socketID])],
    },
    get: {
        selectReady: `SELECT count(*) count FROM players WHERE 
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
    }

}

module.exports = players