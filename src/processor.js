const Database = require('./database');
const Controller = require('./controller');
const Cache = require('./cache');

class Processor {
    constructor() {
        this.db = new Database('nlgm.db');
        this.controller = new Controller(115200);
        this.cache = new Cache();
        this.timeout = undefined;
        this.renderCallback = undefined;
        this.portCloseCallaback = undefined;
        this.isSaving = false;
    }
    static default() {
        return new Processor();
    }
    init() {
        this.db.init()//.testInsert();
        return this;
    }
    async checkPort() {
        await this.controller.reInit(this);
        return this;
    }
    shutdown() {
        this.db.shutdown();
        this.controller.shutdown();
        return this;
    }
    handleData(data) {
        console.log(data);

        if (data == 'a') {
            isSaving = true;
        } else if (data == 'f') {
            isSaving = false;
        } else if (isSaving) {
            this.cache.add(data);
            this.cache.process();
        } else {
            console.error('Unhandled data!');
        }

        /* clearTimeout(timeout);
        timeout = setTimeout(() => {
            this.isSaving = false;
            this.cache.done();
            this.renderCallback(this.cache.objects);
        }, 1000); */
    }
    handleClose() {
        if (this.portCloseCallaback) {
            this.portCloseCallaback();
        }
    }
    canSave() {
        return this.cache.objects.length == 2;
    }
    saveData(patient, l1, l2) {
        this.db.insert(patient, { l1, l2, m1: this.cache.get(0), m2: this.cache.get(1) });
        this.clearCache();
        return this;
    }
    clearCache() {
        this.cache.clear();
        this.renderCallback(this.cache.objects);
        return this;
    }
    setWindowCallbacks(window) {
        this.renderCallback = (cache) => window.webContents.send('measurement', cache);
        this.portCloseCallaback = () => window.webContents.send('port-closed');
        this.sendPortInfoCallback = (controller) => window.send('port-info', controller.getInfo());
    }
}

module.exports = Processor;
