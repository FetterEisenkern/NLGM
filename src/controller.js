const SerialPort = require('serialport');
/* const SerialPort = require('serialport/test');
const MockBinding = SerialPort.Binding;
MockBinding.createPort('/dev/fake', { echo: true, record: true }) */
const Readline = require('@serialport/parser-readline');

class Controller {
    constructor(baudRate) {
        this.baudRate = baudRate;
        this.port = undefined;
        this.parser = undefined;
        this.io = undefined;
        this.portOpened = false;
    }
    async init(processor) {
        this.io = undefined;
        await SerialPort.list((err, ports) => {
            if (err) {
                console.error(err);
            } else {
                for (let port of ports) {
                    if (port.manufacturer && port.manufacturer.startsWith('Arduino')) {
                        this.io = {
                            name: port.comName,
                            id: port.pnpId,
                            mf: port.manufacturer
                        };
                        break;
                    }
                }
            }
        });

        if (this.io != undefined) {
            this.port = new SerialPort(this.io.name, { baudRate: this.baudRate }, (err) => {
                if (err) {
                    console.error(`SerialPort: ${err.message}`);
                }
            });

            this.parser = this.port.pipe(new Readline({ delimiter: '\r\n' }));
            this.parser.on('data', processor.handleData.bind(processor));

            this.port.on('open', () => {
                this.portOpened = true;
                processor.sendPortInfoCallback(this);
            });

            this.port.on('close', processor.handleClose.bind(processor));
        } else {
            console.error('Failed to find port!');
            processor.sendPortInfoCallback(this);
        }
    }
    shutdown() {
        if (this.isConnected()) {
            this.portOpened = false;
        }
        this.io = undefined;
        return this;
    }
    async reInit(processor) {
        this.shutdown();
        await this.init(processor);
        return this;
    }
    isConnected() {
        return this.portOpened;
    }
    getInfo() {
        return {
            info: this.io
        };
    }
    send(command) {
        if (this.portOpened) {
            this.port.write(command, (err) => {
                if (err) {
                    console.error(`Failed to send command: ${err.message}`);
                }
            });
        }
    }
}

module.exports = Controller;
