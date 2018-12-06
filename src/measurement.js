const Point = require('./point');

class Measurement {
    constructor() {
        this.isRunning = false;
        this.points = [];
    }
    start() {
        this.isRunning = true;
    }
    finish() {
        this.points = [];
        this.isRunning = false;
    }
    // 2.000 [mV], 1 [ms]
    process(data) {
        var m = data.split(',');
        var point = new Point(parseFloat(m[0]), parseFloat(m[1]));
        this.points.push(point);
    }
    getTestData() {
        let point = (volt, ms) => new Point(volt, ms);
        return {
            l1: 100,
            l2: 200,
            m1: [point(0, 0), point(0, 1), point(0, 2), point(0, 3), point(0, 4), point(0, 5), point(0, 6), point(0, 7), point(0, 8), point(0, 9), point(0, 10), point(0, 11), point(0, 12), point(0, 13), point(0, 14), point(0, 15), point(0, 16), point(1, 17), point(2, 18), point(3, 19), point(4, 20), point(5, 21), point(6, 22), point(7, 23), point(8, 24), point(10, 25), point(345, 26), point(10, 27), point(8, 28), point(7, 29), point(6, 30), point(5, 31), point(4, 32), point(3, 33), point(2, 34), point(1, 35), point(0, 36), point(0, 37), point(0, 38)],
            m2: [point(0, 0), point(0, 1), point(0, 2), point(0, 3), point(0, 4), point(0, 5), point(10, 6), point(333, 7), point(10, 8), point(8, 9), point(7, 10), point(6, 11), point(5, 12), point(4, 13), point(3, 14), point(2, 15), point(1, 16), point(0, 17), point(0, 18), point(0, 19)],
            result: 100
        };
    }
}

module.exports = Measurement;
