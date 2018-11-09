const { team, updateMultiple } = require('./constants')

class SQL {
    constructor() {

        this.drop = {
            namespace: `DROP TABLE IF EXISTS namespaces;`,
            session: `DROP TABLE IF EXISTS sessions;`,
            message: `DROP TABLE IF EXISTS chats;`,
            player: `DROP TABLE IF EXISTS players;`,
            game: `DROP TABLE IF EXISTS games;`,
            word: `DROP TABLE IF EXISTS words;`
        }

        this.create = {
            namespace: `CREATE TABLE IF NOT EXISTS namespaces (
                nsp_id TEXT PRIMARY KEY,
                display TEXT DEFAULT 'waiting'
                );`,
            session: `CREATE TABLE IF NOT EXISTS sessions (
                session_id   TEXT PRIMARY KEY,
                nsp_id   TEXT,
                display_name    TEXT,
                socket_id   TEXT,
                ready   BOOLEAN DEFAULT 0 CHECK (ready in (0,1)),
                    FOREIGN KEY (nsp_id) REFERENCES namespaces(nsp_id)
                );`,
            message: `CREATE TABLE IF NOT EXISTS chats (
                chat_id INTEGER PRIMARY KEY,
                nsp_id  text    NOT NULL,
                session_id  text,
                display_name text,
                socket_id text,
                message text    NOT NULL,
                    FOREIGN KEY (nsp_id) REFERENCES namespaces(nsp_id),
                    FOREIGN KEY (session_id) REFERENCES sessions(session_id),
                    FOREIGN KEY (display_name) REFERENCES sessions(display_name),
                    FOREIGN KEY (socket_id) REFERENCES sessions(socket_id) ON UPDATE CASCADE
                );`,
            player: `CREATE TABLE IF NOT EXISTS players (
                game_id TEXT,
                nsp_id   TEXT    NOT NULL,
                session_id  TEXT,
                socket_id   TEXT,
                display_name    TEXT,
                team    TEXT    DEFAULT NULL    CHECK (team in (NULL, 'blue', 'red')),
                ready   BOOLEAN DEFAULT 0 CHECK (ready in (0,1)),
                    PRIMARY KEY (game_id,session_id),
                    FOREIGN KEY (nsp_id) REFERENCES namespaces(nsp_id)
                    FOREIGN KEY (game_id) REFERENCES games(game_id),
                    FOREIGN KEY (session_id) REFERENCES sessions(session_id),
                    FOREIGN KEY (socket_id) REFERENCES sessions(socket_id) ON UPDATE CASCADE
                );`,
            game: `CREATE TABLE IF NOT EXISTS games (
               game_id  TEXT    PRIMARY KEY,
               nsp_id   TEXT    NOT NULL,
               active BOOLEAN DEFAULT 1 CHECK (active in (0,1)),
                   FOREIGN KEY (nsp_id) REFERENCES namespaces(nsp_id)
                );`,
            word: `CREATE TABLE IF NOT EXISTS words (
               game_id TEXT NOT NULL,
               row INTEGER NOT NULL CHECK (row in (0,1,2,3,4)),
               column INTEGER NOT NULL CHECK (column in (0,1,2,3,4)),
               word TEXT NOT NULL,
               type TEXT NOT NULL CHECK (type in ('blue', 'red', 'assassin', 'decoy')),
               covered BOOLEAN DEFAULT 0 CHECK (covered in (0,1)),
               by TEXT CHECK (by in ('blue', 'red')),
                   PRIMARY KEY (game_id,row,column),
                   FOREIGN KEY (game_id) REFERENCES games(game_id)
               );`
        }

        this.insert = {
            namespace: `INSERT INTO namespaces(nsp_id) VALUES (?)`,
            session: `INSERT INTO sessions(session_id, nsp_id) VALUES (?, ?);`,
            message: `INSERT INTO chats(nsp_id, message, display_name, socket_id, session_id) 
                    SELECT (?), (?), (?), (?), session_id FROM sessions WHERE socket_id = (?);`,
            player: `INSERT INTO players(game_id, session_id, nsp_id, socket_id, display_name)
                    SELECT (?), session_id, nsp_id, socket_id, display_name
                    FROM sessions WHERE nsp_id = (?)`,
            word:   `INSERT INTO words(game_id, row, column, word, type) VALUES (?, ?, ?, ?, ?);`,
            words: (params, gameID) => ['word',
                params.map(param => [gameID, param.row, param.column, param.word, param.value])]
        }

        //

        this.update = {
            display: `UPDATE namespaces SET display = ? WHERE nsp_id = ?`,
            socketID: `UPDATE sessions SET socket_id = ? WHERE session_id = ?`,
            displayName: `UPDATE sessions SET display_name = ?, socket_id = ? WHERE session_id = ?`,
            waitingReady: `UPDATE sessions SET ready = 1 WHERE socket_id = ?`,
            selectReady: `UPDATE players SET ready = 1 WHERE socket_id = ?`,
            team: `UPDATE players SET team = (?) WHERE socket_id = (?);`,
            disconnect: `UPDATE sessions SET socket_id = ? WHERE socket_id = ?`,
            resetReady: `UPDATE sessions SET ready = 0 WHERE nsp_id = ?`,
            teams: (params) => [team, params.map(param => [param.team, param.socketID])]
        }

        this.get = {
            display: `SELECT display FROM namespaces WHERE nsp_id = (SELECT nsp_id FROM sessions WHERE session_id = ?)`,
            joining: `SELECT count(*) count FROM sessions WHERE nsp_id = (?) AND display_name IS NULL`,
            waitingReady: `SELECT count(*) count FROM sessions WHERE nsp_id = (?) AND ready = 0`,
            selectReady: `SELECT count(*) count FROM players WHERE 
            game_id IN (SELECT game_id FROM namespaces WHERE nsp_id = (?)) AND ready = 0`,
            namespace: `SELECT nsp_id nspID FROM namespaces WHERE nsp_id = ?`,
            resume: `SELECT nsp_id nspID, display_name displayName FROM sessions WHERE session_id = ?`,
            team: `SELECT team FROM players WHERE socket_id = ?`,
            checkPlayerMax:
                `SELECT count(*) total,
            sum(case when team = 'blue' then 1 else 0 end) blueCount,
            sum(case when team = 'red' then 1 else 0 end) redCount
            FROM players WHERE game_id IN (SELECT game_id FROM namespaces WHERE nsp_id = (?))`
        }

        this.all = {
            session: `SELECT display_name name,
                        socket_id socketID,
                        session_id sessionID
                FROM sessions
                WHERE nsp_id = ? AND display_name IS NOT NULL
                ORDER BY display_name;`,
            message: `SELECT message entry,
                        socket_id socketID,
                        display_name name
                        FROM chats
                        WHERE nsp_id = ?;`,
            team: `SELECT display_name name,
                        socket_id socketID,
                        team
                    FROM players
                    WHERE game_id IN (SELECT game_id FROM namespaces WHERE nsp_id = (?))
                    ORDER BY display_name;`,
            unsorted: `SELECT display_name name,
                        socket_id socketID,
                        team
                    FROM players
                    WHERE game_id IN (SELECT game_id FROM namespaces WHERE nsp_id = (?)) AND team IS NULL
                    ORDER BY display_name;`
        }
    }

    updateTeams(sql, params) {

        return `UPDATE players`


    }

}

module.exports = new SQL()