const mysql = require('mysql');
const Point = require('./point');

class Cloud {
    constructor(name, handleConnected, handleNotConnected) {
        this.name = name;
        this.handleConnected = handleConnected;
        this.handleNotConnected = handleNotConnected;
        this.db = undefined;
        this.connected = false;
    }
    init(config) {
        this.db = mysql.createConnection({ ...config, database: this.name });
        this.db.connect((err) => {
            if (err) {
                this.connected = false;
                this.handleNotConnected(err.message);
                return console.error(err);
            }

            this.connected = true;
            this.handleConnected();
            console.log(`Connected to cloud!`);

            this.db.query(`CREATE TABLE IF NOT EXISTS patients(
                               patientId   INTEGER PRIMARY KEY AUTO_INCREMENT,
                               firstName   VARCHAR(32),
                               lastName    VARCHAR(32),
                               dateOfBirth DATE,
                               createdAt   DATE)`, () => {
                this.db.query(`CREATE TABLE IF NOT EXISTS nlgm(
                               id      INTEGER PRIMARY KEY AUTO_INCREMENT,
                               patient INTEGER,
                               date    DATE,
                               data    BLOB,
                               FOREIGN KEY(patient) REFERENCES patients(patientId))`);
                }
            );

            for (let i = 0; i < 3; ++i) { this.testInsert(); };
            //this.testSelectAll();
            //this.testSelectAllPatients();
        });
    }
    shutdown() {
        this.connected = false;
        this.handleNotConnected();
        if (this.db) {
            this.db.destroy();
        }
    }
    isConnected() {
        return this.db && this.connected;
    }
    insert(data, callback = undefined) {
        if (data.patient.id === undefined) {
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

        this.db.query(`INSERT INTO nlgm (patient, date, data)
                       VALUES (?, date('now'), ?)`, [id, buffer], callback);
    }
    insertPatient(data) {
        console.log('hi')
        this.db.query(`INSERT INTO patients (firstName, lastName, dateOfBirth, createdAt)
                       VALUES (?, ?, date(?), date('now'))`, [data.firstName, data.lastName, data.dateOfBirth]);
    }
    selectPatient(id, callback) {
        this.db.query(`SELECT id, firstName, lastName, dateOfBirth, createdAt
                         FROM patients
                        WHERE id == ?`, [id])
                .on('result', callback);
    }
    selectAll(callback) {
        this.db.query(`SELECT id, patient, patients.firstName, patients.lastName, date, data
                         FROM nlgm
                              INNER JOIN patients
                              ON patients.patientId == patient
                              ORDER BY id DESC`)
                .on('result', callback);
    }
    selectAllPatients(callback) {
        this.db.query(`SELECT patientId, firstName, lastName, dateOfBirth, createdAt
                         FROM patients
                        ORDER BY patientId DESC`)
                .on('result', callback);
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
        let p = (mv, us) => new Point(mv, us);
        var data = {
            patient: {
                id: 1,
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
        this.db.query(`DELETE FROM nlgm
                        WHERE id == ?`, [id], callback);
    }
    deletePatient(id, callback = undefined) {
        this.db.query(`DELETE FROM patients
                        WHERE patientId == ?;
                       DELETE FROM nlgm
                        WHERE patient == ?`, [id, id], callback);
    }
}

module.exports = Cloud;
