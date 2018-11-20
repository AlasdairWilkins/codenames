const actions = require('./actions');
const keys = require('./keys');
const types = require('./types');

module.exports = { ...actions, ...keys, ...types };