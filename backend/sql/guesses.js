const guesses = {
    create: `CREATE TABLE IF NOT EXISTS guesses (
                game_id TEXT NOT NULL,
                team TEXT CHECK (team in ('blue', 'red')),
                turn INTEGER NOT NULL,
                codeword TEXT,
                word TEXT,
                type TEXT,
                guess INTEGER,
                of INTEGER,
                    PRIMARY KEY (game_id,word),
                    FOREIGN KEY (game_id) REFERENCES games(game_id)
                );`,
    insert: `INSERT INTO guesses(game_id, team, turn, codeword, guess, of, word, type)
                    SELECT game_id, team, turn, codeword, guesses + 1, of, (?),
                     (SELECT type FROM words WHERE word = (?) AND 
                        game_id = (SELECT game_id FROM games WHERE nsp_id = (?)))
                    FROM games WHERE nsp_id = (?)`,
    get: `SELECT team, word, type, guess, of FROM guesses WHERE 
                            game_id = (SELECT game_id FROM namespaces WHERE nsp_id = (?))
                            AND guess = (SELECT guesses FROM games WHERE game_id =
                                (SELECT game_id FROM namespaces WHERE nsp_id = (?)));`,

}

module.exports = guesses