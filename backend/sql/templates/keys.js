const primary = function() {
    return new PrimaryKey(...arguments)
}

const PrimaryKey = function() {
    this.keys = new Array(...arguments)
}

PrimaryKey.prototype.save = function() {
    return `PRIMARY KEY (` + this.keys.join(",") + `)`
}

const foreign = function(column, foreignTable, foreignColumn) {
    return new ForeignKey(column, foreignTable, foreignColumn)
}

const ForeignKey = function(column, foreignTable, foreignColumn) {
    this.column = column
    this.foreignTable = foreignTable
    this.foreignColumn = (foreignColumn) ? foreignColumn : column
}

ForeignKey.prototype.save = function() {
    return `FOREIGN KEY (${this.column}) REFERENCES ${this.foreignTable}(${this.foreignColumn})`
}

module.exports = {primary, foreign}