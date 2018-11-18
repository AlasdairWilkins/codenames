
const drop = function(table) {
    return `DROP TABLE IF EXISTS ` + table + `;`
}

module.exports = {drop}