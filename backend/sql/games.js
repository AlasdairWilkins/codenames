const {create, text, int, bool, foreign} = require('./templates');



const games = {
    create: create('games', text('game_id').primary(), text('nsp_id').notNull(),
        text('team').checkIn(null, 'blue', 'red'), int('turn'), text('codeword'), int('guesses'), int('of'),
        bool('active', true), text('winner').checkIn(null, 'blue', 'red'), foreign('nsp_id', 'namespaces')),

    insert: `INSERT INTO games(game_id, nsp_id) VALUES (?, ?)`,
    update: {
        codeword: `UPDATE games SET codeword = ?, number = ? WHERE
                      game_id = (SELECT game_id FROM namespaces WHERE nsp_id = (?))`,
        newGame: `UPDATE games SET team = (?), turn = 1 WHERE nsp_id = (?);`,
        turnTEST: `UPDATE games SET team = ?, turn = 1, codeword = "hey", guesses = 0, of = 3 WHERE nsp_id = ?;`,
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
        turn: `SELECT turn, team FROM games WHERE nsp_id = (?);`,
        gameState: `SELECT * FROM games WHERE nsp_id = (?);`,
        codeword: `SELECT codeword FROM games WHERE nsp_id = (?);`
    }
};

module.exports = games;