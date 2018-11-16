const namespaces = {
    drop: `DROP TABLE IF EXISTS namespaces;`,
    create: `CREATE TABLE IF NOT EXISTS namespaces (
                nsp_id TEXT PRIMARY KEY,
                display TEXT DEFAULT 'waiting'
                );`,
    insert: `INSERT INTO namespaces(nsp_id) VALUES (?)`,
    update: `UPDATE namespaces SET display = ? WHERE nsp_id = ?`,
    get: {
        display: `SELECT display FROM namespaces WHERE nsp_id = (SELECT nsp_id FROM sessions WHERE session_id = ?)`,
        namespace: `SELECT nsp_id nspID FROM namespaces WHERE nsp_id = ?`,
    }
}

module.exports = namespaces