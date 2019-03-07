const sqlite3 = require('sqlite3');
const Point = require('./point');

class Database {
    constructor(file) {
        this.db = new sqlite3.Database(file);
    }
    init(callback) {
        this.db.run(`CREATE TABLE IF NOT EXISTS patients(
            patientId   INTEGER PRIMARY KEY AUTOINCREMENT,
            firstName   VARCHAR(32),
            lastName    VARCHAR(32),
            dateOfBirth DATE,
            createdAt   DATE)`, () => {
                this.db.run(`CREATE TABLE IF NOT EXISTS nlgm(
                    id      INTEGER PRIMARY KEY AUTOINCREMENT,
                    patient INTEGER,
                    date    DATE,
                    data    BLOB,
                    FOREIGN KEY(patient) REFERENCES patients(id))`, callback);
            });
    }
    shutdown() {
        this.db.close();
    }
    insert(data, callback = undefined) {
        if (data.patient.id == undefined) {
            let that = this;
            this.insertPatient(data.patient, function () {
                that.insertData(this.lastID, data.data, callback);
            });
        } else {
            this.insertData(data.patient.id, data.data, callback);
        }
    }
    insertData(id, data, callback = undefined) {
        let buffer = Buffer.from(JSON.stringify({
            l1: data.l1,
            l2: data.l2,
            m1: data.m1,
            m2: data.m2,
            result: data.result
        }));

        return this.db.prepare(`INSERT INTO nlgm (patient, date, data) VALUES (?, date('now'), ?)`)
            .run([id, buffer], callback)
            .finalize();
    }
    insertPatient(data, callback = undefined) {
        return this.db.prepare(`INSERT INTO patients (firstName, lastName, dateOfBirth, createdAt) VALUES (?, ?, date(?), date('now'))`)
            .run([data.firstName, data.lastName, data.dateOfBirth], callback)
            .finalize();
    }
    selectPatient(id, callback) {
        this.db.each(`SELECT id, firstName, lastName, dateOfBirth, createdAt
                      FROM patients
                      WHERE id == ?`, id, callback);
    }
    selectAll(callback) {
        this.db.each(`SELECT id, patient, patients.firstName, patients.lastName, date, data
                      FROM nlgm
                      INNER JOIN patients ON patients.patientId == patient
                      ORDER BY id DESC`, callback);
    }
    selectAllPatients(callback) {
        this.db.each(`SELECT patientId, firstName, lastName, dateOfBirth, createdAt
                      FROM patients
                      ORDER BY patientId DESC`, callback);
    }
    testSelectAll() {
        this.selectAll((err, row) => {
            if (row) {
                console.log(`${row.id} | ${row.firstName} | ${row.lastName} | ${row.dateOfBirth} | ${row.date}`);
            } else {
                console.error(err);
            }
        });
    }
    testSelectAllPatients() {
        this.selectAllPatients((err, row) => {
            if (row) {
                console.log(`${row.patientId} | ${row.firstName} | ${row.lastName} | ${row.dateOfBirth} | ${row.createdAt}`);
            } else {
                console.error(err);
            }
        });
    }
    testInsert() {
        let p = (volt, ms) => new Point(volt, ms);
        var data = {
            patient: {
                id: undefined,
                firstName: 'Hansi',
                lastName: 'Hansen',
                dateOfBirth: '1998-10-10'
            },
            data: {
                l1: 20,
                l2: 18,
                m1: [p(0, 0), p(0, 1), p(0, 2), p(0, 3), p(0, 4), p(0, 5), p(0, 6), p(0, 7), p(0, 8), p(0, 9), p(0, 10), p(0, 11), p(0, 12),
                p(0, 13), p(0, 14), p(0, 15), p(0, 16), p(1, 17), p(2, 18), p(3, 19), p(4, 20), p(5, 21), p(6, 22), p(7, 23), p(8, 24),
                p(10, 25), p(345, 26), p(10, 27), p(8, 28), p(7, 29), p(6, 30), p(5, 31), p(4, 32), p(3, 33), p(2, 34), p(1, 35), p(0, 36),
                p(0, 37), p(0, 38)],
                m2: [p(0, 0), p(0, 1), p(0, 2), p(0, 3), p(0, 4), p(0, 5), p(10, 6), p(333, 7), p(10, 8), p(8, 9), p(7, 10), p(6, 11), p(5, 12),
                p(4, 13), p(3, 14), p(2, 15), p(1, 16), p(0, 17), p(0, 18), p(0, 19)],
                result: 1
            }
        };
        this.insert(data);
    }
    delete(id, callback = undefined) {
        this.db.prepare('DELETE FROM nlgm WHERE id == ?')
            .run([id], callback)
            .finalize();
    }
    deletePatient(id, callback = undefined) {
        this.db.prepare('DELETE FROM patients WHERE patientId == ?')
            .run([id], () => {
                this.db.prepare('DELETE FROM nlgm WHERE patient == ?')
                    .run([id], callback)
                    .finalize();
            })
            .finalize();
    }
}

module.exports = Database;
