const SerialPort = require('serialport');
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
                return console.error(err);
            }

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
        });

        if (this.io !== undefined) {
            this.port = new SerialPort(this.io.name, { baudRate: this.baudRate }, (err) => {
                if (err) {
                    console.error(`SerialPort: ${err.message}`);
                }
            });

            this.parser = this.port.pipe(new Readline({ delimiter: '\r\n' }));
            this.parser.on('data', processor.handleData.bind(processor));

            this.port.on('open', () => {
                this.portOpened = true;
                processor.sendPortInfo(this);
            });

            this.port.on('close', processor.handleClose.bind(processor));
        } else {
            console.error('Failed to find port!');
            processor.sendPortInfo(this);
        }
    }
    shutdown() {
        if (this.isConnected()) {
            this.portOpened = false;
        }
        this.io = undefined;
    }
    async reInit(processor) {
        this.shutdown();
        await this.init(processor);
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
                    return console.error(`Failed to send command: ${err.message}`);
                }
                console.log(`app -> device: ${command}`);
            });
        }
    }
}

module.exports = Controller;
