const Column = require('./column')

const text = function(name) {
    return new Column(name, 'TEXT')
}

const int = function(name) {
    return new Column(name, 'INTEGER')
}

const bool = function(name, value) {
    return new Column(name, 'BOOLEAN').default(value ? 1 : 0).checkIn(0, 1)
}

module.exports = {text, int, bool}