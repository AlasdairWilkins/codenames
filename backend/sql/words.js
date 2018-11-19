const {create, text, int, bool, primary, foreign} = require('./templates')

const words = {
    create: create(
        "words",
        text('game_id').notNull(),
        int('row').notNull().checkIn(0, 1, 2, 3, 4),
        int('column').notNull().checkIn(0, 1, 2, 3, 4),
        text('word').notNull(),
        text('type').notNull().checkIn('blue', 'red', 'assassin', 'decoy'),
        bool('covered', false),
        text('by').checkIn('blue', 'red'),
        primary('game_id', 'row', 'column'),
        foreign('game_id', 'games')
    ),
    insert: {
        words: (params, nspID) => [`INSERT INTO words(row, column, word, type, game_id) SELECT (?), (?), (?), (?),
                    game_id FROM games WHERE nsp_id = (?);`,
            params.map(param => [param.row, param.column, param.word, param.value, nspID])],
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