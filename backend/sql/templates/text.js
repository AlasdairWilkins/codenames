const text = function(name) {
    return new Column(name, 'TEXT')
}

const int = function(name) {
    return new Column(name, 'INTEGER')
}

const bool = function(name, value) {
    return new Column(name, 'BOOLEAN').default(value ? 1 : 0).checkIn(0, 1)
}

const primary = function() {
    return new PrimaryKey(...arguments)
}

const foreign = function(column, foreignTable, foreignColumn) {
    return new ForeignKey(column, foreignTable, foreignColumn)
}

const PrimaryKey = function() {
    this.keys = new Array(...arguments)
}

const ForeignKey = function(column, foreignTable, foreignColumn) {
    this.column = column
    this.foreignTable = foreignTable
    this.foreignColumn = (foreignColumn) ? foreignColumn : column
}

PrimaryKey.prototype.save = function() {
    return `PRIMARY KEY (` + this.keys.join(",") + `)`
}

ForeignKey.prototype.save = function() {
    return `FOREIGN KEY (${this.column}) REFERENCES ${this.foreignTable}(${this.foreignColumn})`
}

const Column = function(name, type) {
    this.name = name
    this.type = type
}

Column.prototype.checkIn = function() {
    this.checkIn = `CHECK (${this.name} in (` +
        Array(...arguments).map(item => typeof item === 'string' ? `'${item}'` : item).join(",") + `))`
    return this
}

Column.prototype.unique = function() {
    this.unique = 'UNIQUE'
    return this
}

Column.prototype.default = function(value) {
    this.default = `DEFAULT ${value}`
    return this
}

Column.prototype.notNull = function() {
    this.notNull = 'NOT NULL'
    return this
}

Column.prototype.primary = function() {
    this.primary = 'PRIMARY KEY'
    return this
}

Column.prototype.save = function() {
    return Object.values(this).join(" ")
}

const create = function() {
    let table = arguments[0]
    let columns = Array(...arguments).slice(1)

    return `CREATE TABLE IF NOT EXISTS ${table} (` +
        columns.map(item => item.save()).join(", ") + `);`

}

const words =
    `CREATE TABLE IF NOT EXISTS words (game_id TEXT NOT NULL, row INTEGER NOT NULL CHECK (row in (0,1,2,3,4)), column INTEGER NOT NULL CHECK (column in (0,1,2,3,4)), word TEXT NOT NULL, type TEXT NOT NULL CHECK (type in ('blue','red','assassin','decoy')), covered BOOLEAN DEFAULT 0 CHECK (covered in (0,1)), by TEXT CHECK (by in ('blue','red')), PRIMARY KEY (game_id,row,column), FOREIGN KEY (game_id) REFERENCES games(game_id));`

// console.log(bool('covered', false).save())

// console.log(primary('game_id', 'row').save())

console.log(words)

console.log(create(
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
    ) === words
)




// create: create(
//     'words',
//     text('game_id', is('NOT NULL')),
//     int('row', is('NOT NULL'), checkIn('row', [0, 1, 2, 3, 4])),
//     int('column', is('NOT NULL'), checkIn('column', [0, 1, 2, 3, 4])),
//     text('word', is('NOT NULL')),
//     text('type', is('NOT NULL'), checkIn('type', ['blue', 'red', 'assassin', 'decoy'])),
//     bool('covered', false),
//     text('by', checkIn('by', ['blue', 'red'])),
//     primary('game_id', 'row', 'column'),
//     foreign('game_id', 'games')
// ),

// console.log(text('name_id').unique().notNull().primary().default('0'))