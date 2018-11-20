const {create, text, primary} = require('./templates');

const namespaces = {
    create: create('namespaces', text('nsp_id'), text('display').default('waiting'), primary('nsp_id')),

    insert: `INSERT INTO namespaces(nsp_id) VALUES (?)`,
    update: `UPDATE namespaces SET display = ? WHERE nsp_id = ?`,
    get: {
        display: `SELECT display FROM namespaces WHERE nsp_id = (SELECT nsp_id FROM sessions WHERE session_id = ?)`,
        namespace: `SELECT nsp_id nspID FROM namespaces WHERE nsp_id = ?`,
    }
};

module.exports = namespaces;