const drop = function(table) {
    return `DROP TABLE IF EXISTS ` + table + `;`
};

const create = function() {
    let table = arguments[0];
    let columns = Array(...arguments).slice(1);

    return `CREATE TABLE IF NOT EXISTS ${table} (` +
        columns.map(item => item.save()).join(", ") + `);`

};

module.exports = {drop, create};