const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');

class Controller {
    constructor(baudRate) {
        this.baudRate = baudRate;
        this.port = undefined;
        this.parser = undefined;
        this.io = undefined;
    }
    init() {
        return SerialPort.list((err, ports) => {
            if (err) {
                console.error(err);
            } else {
                for (let port of ports) {
                    if (port.manufacturer && port.manufacturer.startsWith("Arduino")) {
                        this.io = {
                            name: port.comName,
                            id: port.pnpId,
                            mf: port.manufacturer
                        };
                        break;
                    }
                }
            }
        }).then(() => {
            if (this.io != undefined) {
                this.port = new SerialPort(this.io.name, { baudRate: this.baudRate }, (err) => console.error(err));
                this.parser = this.port.pipe(new Readline({ delimiter: '\r\n' }));

                if (this.isConnected()) {
                    console.log(`Opened port to: ${this.io.name}`);
                } else {
                    console.error(`Failed to open port to: ${this.io.name}`);
                }
            } else {
                console.error("Failed to find port!");
            }
        });
    }
    shutdown() {
        if (this.isConnected()) {
            this.parser.destroy();
            this.port.close();
        }
        this.io = undefined;
        return this;
    }
    reInit() {
        this.shutdown();
        this.init();
        return this;
    }
    isConnected() {
        return this.port && this.port.isOpen;
    }
    listenOn(event, callback) {
        if (this.parser != undefined) {
            this.parser.on(event, callback);
        }
        return this;
    }
    getInfo() {
        return {
            info: this.io,
            isConnected: this.isConnected()
        };
    }
}

module.exports = Controller;
