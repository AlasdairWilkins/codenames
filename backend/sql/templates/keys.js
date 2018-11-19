const PrimaryKey = require('./primarykey')
const ForeignKey = require('./foreignkey')

const primary = function() {
    return new PrimaryKey(...arguments)
}

const foreign = function(column, foreignTable, foreignColumn) {
    return new ForeignKey(column, foreignTable, foreignColumn)
}

module.exports = {primary, foreign}