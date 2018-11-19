
const drop = function(table) {
    return `DROP TABLE IF EXISTS ` + table + `;`
};

const create = function() {
    return `CREATE TABLE IF NOT EXISTS ` + arguments[0] + ` (` + Array(...arguments).slice(1).join(", ") + `);`
};

const def = function(value) {
    return ` DEFAULT ` + value
};

const checkIn = function(column, range) {
    return `CHECK (` + column + ` in (` + range.map(item => (typeof item === 'string' ? `'${item}'` : item)).join(",") + `))`
};

const text = function() {
    return column("TEXT", ...arguments)
};

const int = function() {
    return column("INTEGER", ...arguments)
};

const bool = function(column, initial) {
    return column + ` BOOLEAN` + def((initial) ? 1 : 0) + checkIn(column, [0, 1])
};

const is = function() {
    return " " + Array(...arguments).join(" ")
}

const column = function() {
    return arguments[1] + ` ` + arguments[0] + Array(...arguments).slice(2).join("")
}

const primary = function() {
    return `PRIMARY KEY (` + Array(...arguments).join(",") + `)`
};

const foreign = function(column, foreignTable, foreignColumn) {
    return `FOREIGN KEY (` + column + `) REFERENCES ` + foreignTable + `(` +
        (foreignColumn ? foreignColumn : column) + `)`
}

module.exports = {drop, create, text, def, int, bool, primary, foreign, is, checkIn};


const words =
    `CREATE TABLE IF NOT EXISTS words (game_id TEXT NOT NULL, row INTEGER NOT NULL CHECK (row in (0,1,2,3,4)), column INTEGER NOT NULL CHECK (column in (0,1,2,3,4)), word TEXT NOT NULL, type TEXT NOT NULL CHECK (type in ('blue','red','assassin','decoy')), covered BOOLEAN DEFAULT 0 CHECK (covered in (0,1)), by TEXT CHECK (by in ('blue','red')), PRIMARY KEY (game_id,row,column), FOREIGN KEY (game_id) REFERENCES games(game_id));`

//test

// console.log(checkIn('test_col', ['this', 'that', 3]))

// console.log(foreign('game_id', 'games'))

console.log(words)
//
console.log(create(
    'words',
    text('game_id', is('NOT NULL')),
    int('row', is('NOT NULL'), checkIn('row', [0, 1, 2, 3, 4])),
    int('column', is('NOT NULL'), checkIn('column', [0, 1, 2, 3, 4])),
    text('word', is('NOT NULL')),
    text('type', is('NOT NULL'), checkIn('type', ['blue', 'red', 'assassin', 'decoy'])),
    bool('covered', false),
    text('by', checkIn('by', ['blue', 'red'])),
    primary('game_id', 'row', 'column'),
    foreign('game_id', 'games')
    ) === words)

// console.log(text("hi", def("whoah"), checkIn("hi", "whoah", "ahoy hoy")))
// console.log(text("hi", is('PRIMARY', 'UNIQUE', checkIn("hi", 1, 2, 3))))

// console.log(primary('game_id', 'row' , 'column'))