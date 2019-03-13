const Database = require('./database');
const Controller = require('./controller');
const Measurement = require('./measurement');
const Cloud = require('./cloud');

class Processor {
    constructor() {
        this.db = new Database('nlgm.db');
        this.cloud = new Cloud('nlgm',
            () => this.sendCloudConnected(),
            (error) => this.sendCloudNotConnected(error));
        this.controller = new Controller(115200);
        this.measurement = new Measurement();
        this.timeout = undefined;
        this.maxTimeout = 2000;
        this.sendMeasurementSuccess = undefined;
        this.sendMeasurementError = undefined;
        this.sendDatabaseDataRow = undefined;
        this.sendDatabasePatientRow = undefined;
        this.sendPortClose = undefined;
        this.sendPortInfo = undefined;
        this.sendCloudConnected = undefined;
        this.sendCloudNotConnected = undefined;
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
        this.cloud.shutdown();
        this.controller.shutdown();
    }
    getDb() {
        return this.cloud.isConnected() ? this.cloud : this.db;
    }
    handleData(data) {
        console.log(`device -> app: ${data}`);

        switch (data) {
            case 'ACK':
                {
                    this.measurement.start();
                    break;
                }
            case 'FIN':
                {
                    this.measurement.finish();
                    this.sendMeasurementSuccess(this.measurement);
                    clearTimeout(this.timeout);
                    break;
                }
            default:
                {
                    if (this.measurement.isRunning) {
                        this.measurement.process(data);
                    } else {
                        console.error('Unhandled data!');
                        this.measurement.finish();
                        this.sendMeasurementError();
                        clearTimeout(this.timeout);
                    }
                    break;
                }
        }
    }
    resetTimeout() {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            if (this.measurement.isRunning) {
                this.measurement.finish();
            }
            this.sendMeasurementError();
        }, this.maxTimeout);
    }
    handleClose() {
        if (this.sendPortClose) {
            this.sendPortClose();
        }
    }
    setWindowCallbacks(window) {
        this.sendMeasurementSuccess = (measurement) => window.webContents.send('measurement-success', measurement.getData());
        this.sendMeasurementError = () => window.webContents.send('measurement-error');
        this.sendDatabaseDataRow = (row) => window.webContents.send('db-data-row', row);
        this.sendDatabasePatientRow = (row) => window.webContents.send('db-patient-row', row);
        this.sendPortClose = () => window.webContents.send('port-close');
        this.sendPortInfo = (controller) => window.send('port-info', controller.getInfo());
        this.sendCloudConnected = () => window.send('cloud-connected');
        this.sendCloudNotConnected = (error) => window.send('cloud-not-connected', error);
    }
}

module.exports = Processor;
