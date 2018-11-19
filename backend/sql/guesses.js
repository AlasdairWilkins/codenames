const {create, text, int, primary, foreign} = require('./templates')

const guesses = {
    create: create('guesses', text('game_id').notNull(), text('team').checkIn('blue', 'red'), int('turn').notNull(),
        text('codeword'), text('word'), text('type'), int('guess'), int('of'), primary('game_id', 'word'),
        foreign('game_id', 'games')),

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