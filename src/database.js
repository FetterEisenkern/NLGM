const sqlite3 = require('sqlite3');
const Point = require('./point');

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
    }
    shutdown() {
        this.db.close();
    }
    insert(data, callback = undefined) {
        this.db.serialize(() => {
            this.db.prepare('INSERT INTO nlgm (patient, date, data) VALUES (?, date(\'now\'), ?)')
                .run(data.patient, Buffer.from(JSON.stringify({
                    l1: data.data.l1,
                    l2: data.data.l2,
                    m1: data.data.m1,
                    m2: data.data.m2,
                    result: data.data.result
                })))
                .finalize(callback);
        });
    }
    select(id, callback) {
        this.db.each('SELECT id, patient, date, data FROM nlgm WHERE id == ?', id, callback);
    }
    selectAll(callback) {
        this.db.each('SELECT id, patient, date, data FROM nlgm ORDER BY id DESC', callback);
    }
    testSelectAll() {
        return this.selectAll((_, row) => console.log(`${row.id} | ${row.patient} | ${row.date} | ${row.data}`));
    }
    testInsert() {
        let p = (volt, ms) => new Point(volt, ms);
        var data = {
            patient: 'Hans',
            l1: 100,
            l2: 200,
            m1: [p(0, 0), p(0, 1), p(0, 2), p(0, 3), p(0, 4), p(0, 5), p(0, 6), p(0, 7), p(0, 8), p(0, 9), p(0, 10), p(0, 11), p(0, 12), p(0, 13), p(0, 14), p(0, 15), p(0, 16), p(1, 17), p(2, 18), p(3, 19), p(4, 20), p(5, 21), p(6, 22), p(7, 23), p(8, 24), p(10, 25), p(345, 26), p(10, 27), p(8, 28), p(7, 29), p(6, 30), p(5, 31), p(4, 32), p(3, 33), p(2, 34), p(1, 35), p(0, 36), p(0, 37), p(0, 38)],
            m2: [p(0, 0), p(0, 1), p(0, 2), p(0, 3), p(0, 4), p(0, 5), p(10, 6), p(333, 7), p(10, 8), p(8, 9), p(7, 10), p(6, 11), p(5, 12), p(4, 13), p(3, 14), p(2, 15), p(1, 16), p(0, 17), p(0, 18), p(0, 19)],
            result: 100
        };
        return this.insert(data);
    }
    delete(id) {
        this.db.serialize(() => {
            this.db.prepare('DELETE FROM nlgm WHERE id == ?')
                .run(id)
                .finalize();
        });
    }
}

module.exports = Database;
