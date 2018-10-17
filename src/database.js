const sqlite3 = require('sqlite3');

class Database {
    constructor(file) {
        this.file = file;
        this.db = new sqlite3.Database(this.file);
    }
    init() {
        this.db.run(`CREATE TABLE IF NOT EXISTS nlgm(
            id      INTEGER PRIMARY KEY AUTOINCREMENT,
            patient VARCHAR(32),
            date    DATE,
            data    BLOB)`);
        return this;
    }
    shutdown() {
        this.db.close();
        return this;
    }
    insert(patient, data) {
        this.db.serialize(() => {
            this.db.prepare('INSERT INTO nlgm (patient, date, data) VALUES (?, date(\'now\'), ?)')
                .run(patient, Buffer.from(JSON.stringify(data)))
                .finalize();
        });
        return this;
    }
    select(id, callback) {
        this.db.each('SELECT id, patient, date, data FROM nlgm WHERE id == ?', id, callback);
        return this;
    }
    selectAll(callback) {
        this.db.each('SELECT id, patient, date, data FROM nlgm', callback);
        return this;
    }
    testSelectAll() {
        return this.selectAll((_, row) => console.log(`${row.id} | ${row.patient} | ${row.date} | ${row.data}`));
    }
    testInsert() {
        var data = {
            l1: 100,
            l2: 200,
            m1: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 345, 10, 8, 7, 6, 5, 4, 3, 2, 1, 0, 0, 0],
            m2: [0, 0, 0, 0, 0, 0, 10, 333, 10, 8, 7, 6, 5, 4, 3, 2, 1, 0, 0, 0]
        };
        return this.insert('Hans', data);
    }
}

module.exports = Database;
