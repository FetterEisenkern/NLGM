const Database = require('./database');
const Controller = require('./controller');

class Processor {
    constructor() {
        this.db = new Database('nlgm.db');
        this.controller = new Controller(115200);
        this.cache = undefined;
    }
    static default() {
        return new Processor();
    }
    init() {
        this.db.init().testInsert();
        this.controller
            .init()
            .then(() => {
                if (this.controller.isInitialized) {
                    this.controller.listen(this.listener)
                }
            });
        return this;
    }
    checkPort() {
        if (!this.controller.isInitialized) {
            this.controller.init();
        }
        return this.controller.isInitialized;
    }
    shutdown() {
        this.db.shutdown();
        this.controller.shutdown();
        return this;
    }
    listener(data) {
        console.log(data);
        if (this.cache == undefined) {
            this.createCache();
        }
        this.cache.results[this.cache.curIndex].push(data);
    }
    processCache() {
        this.db.insert(this.cache.patient, { m1: this.cache.results[0], m2: this.cache.results[1] });
        return this;
    }
    processNext() {
        ++this.cache.curIndex;
        return this;
    }
    processPatient(patient) {
        this.cache.patient = patient;
        return this;
    }
    createCache() {
        this.cache = {
            patient: 'Hans',
            curIndex: 0,
            results: []
        };
        return this;
    }
    clearCache() {
        this.cache = undefined;
        return this;
    }
}

module.exports = Processor;
