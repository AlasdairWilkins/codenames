const words = {
    drop: `DROP TABLE IF EXISTS words;`,
    create: `CREATE TABLE IF NOT EXISTS words (
               game_id TEXT NOT NULL,
               row INTEGER NOT NULL CHECK (row in (0,1,2,3,4)),
               column INTEGER NOT NULL CHECK (column in (0,1,2,3,4)),
               word TEXT NOT NULL,
               type TEXT NOT NULL CHECK (type in ('blue', 'red', 'assassin', 'decoy')),
               covered BOOLEAN DEFAULT 0 CHECK (covered in (0,1)),
               by TEXT CHECK (by in ('blue', 'red')),
                   PRIMARY KEY (game_id,row,column),
                   FOREIGN KEY (game_id) REFERENCES games(game_id)
               );`,
    insert: {
        word:   `INSERT INTO words(row, column, word, type, game_id) SELECT (?), (?), (?), (?),
                    game_id FROM games WHERE nsp_id = (?);`,
        words: (params, nspID) => ['word', params.map(param =>
            [param.row, param.column, param.word, param.value, nspID])],
    },
    update: `UPDATE words SET covered = 1, by = 
             (SELECT team FROM games WHERE game_id = (SELECT game_id FROM namespaces WHERE nsp_id = (?)))
              where word = (?) AND game_id = (SELECT game_id FROM namespaces WHERE nsp_id = (?));`,
    get: {
        word: `SELECT type FROM words WHERE row = (?) and column = (?) and 
                    game_id IN (SELECT game_id FROM namespaces WHERE nsp_id = (?))`,
        column: `SELECT word, 
                    CASE 
                    WHEN (SELECT codemaster FROM players WHERE socket_id = (?)) = 1 THEN type
                    ELSE NULL
                    END AS type
                    FROM words WHERE row = (?) and column = (?) and 
                    game_id = (SELECT game_id FROM namespaces WHERE nsp_id = (?))`,
        remaining: `SELECT count(*) remaining FROM words WHERE covered = 0 AND type = (?) AND
                        game_id = (SELECT game_id FROM namespaces WHERE nsp_id = (?));`,
    },
    all: {
        row:    `SELECT word, type, column
                    FROM words
                    WHERE row = (?) AND game_id IN (SELECT game_id FROM games WHERE nsp_id = (?))`,
        words: `SELECT word, type, row, column
                    FROM words
                    WHERE game_id = (SELECT game_id FROM games WHERE nsp_id = (?))`
    }
}

module.exports = words