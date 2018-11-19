const ForeignKey = function(column, foreignTable, foreignColumn) {
    this.column = column
    this.foreignTable = foreignTable
    this.foreignColumn = (foreignColumn) ? foreignColumn : column
}

ForeignKey.prototype.save = function() {
    return `FOREIGN KEY (${this.column}) REFERENCES ${this.foreignTable}(${this.foreignColumn})`
}

module.exports = ForeignKey