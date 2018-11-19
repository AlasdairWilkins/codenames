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

module.exports = Column