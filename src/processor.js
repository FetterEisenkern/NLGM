const Database = require('./database');
const Controller = require('./controller');
const Measurement = require('./measurement');

class Processor {
    constructor() {
        this.db = new Database('nlgm.db');
        this.controller = new Controller(115200);
        this.measurement = new Measurement();
        this.timeout = undefined;
        this.sendMeasurementSuccess = undefined;
        this.sendMeasurementError = undefined;
        this.sendDatabaseDataRow = undefined;
        this.sendDatabasePatientRow = undefined;
        this.sendPortClose = undefined;
        this.sendPortInfo = undefined;
    }
    static default() {
        return new Processor();
    }
    init() {
        this.db.init(() => {
            //for (let i = 0; i < 3; ++i) { this.db.testInsert(); };
            //this.db.testSelectAll();
            //this.db.testSelectAllPatients();
        });
    }
    async checkPort() {
        await this.controller.reInit(this);
    }
    shutdown() {
        this.db.shutdown();
        this.controller.shutdown();
    }
    handleData(data) {
        console.log(data);

        if (data == 'a') {
            this.measurement.start();
        } else if (data == 'f') {
            this.measurement.finish();
            this.sendMeasurementSuccess(this.measurement);
        } else if (this.measurement.isRunning) {
            this.measurement.process(data);
        } else {
            console.error('Unhandled data!');
            this.measurement.finish();
        }

        clearTimeout(timeout);
        timeout = setTimeout(() => {
            if (this.measurement.isRunning) {
                this.measurement.finish();
                this.sendMeasurementError();
            }
        }, 1000);
    }
    handleClose() {
        if (this.sendPortClose) {
            this.sendPortClose();
        }
    }
    setWindowCallbacks(window) {
        //this.sendMeasurementSuccess = (measurement) => window.webContents.send('measurement-success', measurement.getTestData());
        this.sendMeasurementSuccess = (measurement) => window.webContents.send('measurement-success', measurement.getData());
        this.sendMeasurementError = () => window.webContents.send('measurement-error');
        this.sendDatabaseDataRow = (row) => window.webContents.send('db-data-row', row);
        this.sendDatabasePatientRow = (row) => window.webContents.send('db-patient-row', row);
        this.sendPortClose = () => window.webContents.send('port-close');
        this.sendPortInfo = (controller) => window.send('port-info', controller.getInfo());
    }
}

module.exports = Processor;
