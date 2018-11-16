const games = {
    drop: `DROP TABLE IF EXISTS games;`,
    create: `CREATE TABLE IF NOT EXISTS games (
               game_id  TEXT    PRIMARY KEY,
               nsp_id   TEXT    NOT NULL,
               team TEXT    CHECK (team in (null, 'blue', 'red')),
               turn INTEGER,
               codeword TEXT,
               guesses INTEGER,
               of INTEGER,
               active BOOLEAN DEFAULT 1 CHECK (active in (0,1)),
               winner TEXT CHECK (winner in (null, 'blue', 'red')),
                   FOREIGN KEY (nsp_id) REFERENCES namespaces(nsp_id)
                );`,
    insert: `INSERT INTO games(game_id, nsp_id) VALUES (?, ?)`,
    update: {
        codeword: `UPDATE games SET codeword = ?, number = ? WHERE
                      game_id = (SELECT game_id FROM namespaces WHERE nsp_id = (?))`,
        turn: `UPDATE games SET team = ?, turn = 1, codeword = "hey", guesses = 0, of = 3 WHERE nsp_id = ?;`,
        guessEntered: `UPDATE games SET guesses = guesses + 1 WHERE nsp_id = ?;`,
        gameOver: `UPDATE games SET active = 0, winner = 
                        (CASE 
                            WHEN (?) = 0 AND team = 'red' then 'blue'
                            WHEN (?) = 0 AND team = 'blue' then 'red'
                            ELSE team
                        END),
                        team = NULL, turn = NULL, codeword = NULL, guesses = NULL, of = NULL                         
                        WHERE nsp_id = (?)`,
        newTurn: `UPDATE games SET team = 
                        (CASE
                            WHEN team = 'red' then 'blue'
                            ELSE 'red'
                        END),
                        turn = turn + 1, codeword = NULL, guesses = NULL, of = NULL
                        WHERE nsp_id = (?)`
    },
    get: {
        turn: `SELECT turn FROM games WHERE nsp_id = (?);`,
        gameState: `SELECT * FROM games WHERE nsp_id = (?);`
    }
}

module.exports = games