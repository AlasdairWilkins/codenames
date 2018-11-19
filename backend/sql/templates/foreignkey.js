const ForeignKey = function(column, foreignTable, foreignColumn) {
    this.column = column
    this.foreignTable = foreignTable
    this.foreignColumn = (foreignColumn) ? foreignColumn : column
}

ForeignKey.prototype.onUpdate = function(action) {
    this.onUpdate = `ON UPDATE ${action}`
    return this
}

ForeignKey.prototype.onDelete = function(action) {
    this.onDelete = `ON DELETE ${action}`
    return this
}


ForeignKey.prototype.save = function() {
    let mainString = `FOREIGN KEY (${this.column}) REFERENCES ${this.foreignTable}(${this.foreignColumn})`
    let additional = Object.values(this).slice(3).join(" ")
    return additional ? mainString.concat(" ", additional) : mainString
}

module.exports = ForeignKey