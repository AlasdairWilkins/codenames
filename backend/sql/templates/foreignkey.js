const ForeignKey = function(column, foreignTable, foreignColumn) {
    this.column = column;
    this.foreignTable = foreignTable;
    this.foreignColumn = (foreignColumn) ? foreignColumn : column
};

ForeignKey.prototype.onUpdate = function(action) {
    this.onUpdate = `ON UPDATE ${action}`;
    return this
};

ForeignKey.prototype.onDelete = function(action) {
    this.onDelete = `ON DELETE ${action}`;
    return this
};

ForeignKey.prototype.onUpdateCascade = function() {
    return this.onUpdate('CASCADE')
};

ForeignKey.prototype.onUpdateSetNull = function() {
    return this.onUpdate('SET NULL')
};

ForeignKey.prototype.onSetDefault = function() {
    return this.onUpdate('SET DEFAULT')
};

ForeignKey.prototype.onUpdateRestrict = function() {
    return this.onUpdate('RESTRICT')
};

ForeignKey.prototype.onUpdateNoAction = function() {
    return this.onDelete('NO ACTION')
};

ForeignKey.prototype.onDeleteCascade = function() {
    return this.onDelete('CASCADE')
};

ForeignKey.prototype.onDeleteSetNull = function() {
    return this.onDelete('SET NULL')
};

ForeignKey.prototype.onDeleteSetDefault = function() {
    return this.onUpdate('SET DEFAULT')
};

ForeignKey.prototype.onDeleteRestrict = function() {
    return this.onDelete('RESTRICT')
};

ForeignKey.prototype.onDeleteNoAction = function() {
    return this.onDelete('NO ACTION')
};


ForeignKey.prototype.save = function() {
    let mainString = `FOREIGN KEY (${this.column}) REFERENCES ${this.foreignTable}(${this.foreignColumn})`;
    let additional = Object.values(this).slice(3).join(" ");
    return additional ? mainString.concat(" ", additional) : mainString
};

module.exports = ForeignKey;