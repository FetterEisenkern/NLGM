const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');

class Controller {
    constructor(baudRate) {
        this.baudRate = baudRate;
        this.port = undefined;
        this.parser = undefined;
        this.isInitialized = false;
    }
    init() {
        if (this.isInitialized) {
            return;
        }

        let source = undefined;
        return SerialPort.list((err, ports) => {
            if (err) {
                console.error(err);
            } else {
                for (let port of ports) {
                    if (port.manufacturer && port.manufacturer.startsWith("Arduino")) {
                        console.log("Found port!");
                        /*
                            Linux:
                                /dev/ttyACM0
                                usb-Arduino__www.arduino.cc__0043_5543733373735191C140-if00
                                Arduino (www.arduino.cc)
                        */
                        console.log(source.comName);
                        console.log(source.pnpId);
                        console.log(source.manufacturer);
                        source = port;
                        break;
                    }
                }
            }
        }).then(() => {
            if (source != undefined) {
                this.port = new SerialPort(source.comName, { baudRate: this.baudRate }, (err) => console.error(err));
                this.parser = this.port.pipe(new Readline({ delimiter: '\r\n' }));

                this.isInitialized = true;
            } else {
                console.log("Failed to find port!");
            }
        });
    }
    shutdown() {
        if (this.isInitialized && this.port.isOpen) {
            this.parser.destroy();
            this.port.close();
        }
        this.isInitialized = false;
        return this;
    }
    reInit() {
        this.shutdown();
        this.init();
        return this;
    }
    listen(callback) {
        if (this.parser != undefined) {
            this.parser.on('data', callback);
        }
        return this;
    }
}

module.exports = Controller;
