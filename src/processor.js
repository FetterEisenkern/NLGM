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
    }
    static default() {
        return new Processor();
    }
    init() {
        this.db.init()
            //.testInsert();
        this.controller
            .init()
            .then(() => {
                if (this.controller.port) {
                    this.controller.port.on('open', () => {
                        this.controller.listenOn('data', this.handleData);
                        this.controller.listenOn('close', this.handleClose);
                    });
                }
            });
        return this;
    }
    checkPort() {
        this.controller.reInit();
        return this;
    }
    shutdown() {
        this.db.shutdown();
        this.controller.shutdown();
        return this;
    }
    handleData(data) {
        console.log(data);

        /* this.cache.add(data);
        this.cache.process();

        clearTimeout(timeout);
        timeout = setTimeout(() => {
            this.cache.done();
            this.renderCallback(this.cache.objects);
        }, 1000); */
    }
    handleClose() {
        this.portCloseCallaback();
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
}

module.exports = Processor;
