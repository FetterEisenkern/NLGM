class Point {
    constructor(volt, ms)
    {
        this.volt = volt;
        this.ms = ms;
    }
};

class Cache {
    constructor() {
        this.objects = [];
        this.curObject = Cache.createNew();
    }
    add(data) {
        // 2.000 [mV], 1 [ms]
        var m = data.split(',');
        var point = new Point(parseFloat(m[0]), parseFloat(m[1]));
        this.curObject.values[this.curObject.index].push(point);
        return this;
    }
    process() {
        ++this.curObject.curIndex;
        return this;
    }
    done() {
        this.objects.push(this.curObject);
        this.curObject = Cache.createNew();
        return this;
    }
    clear() {
        this.objects = [];
        this.curObject = Cache.createNew();
        return this;
    }
    get(index) {
        return this.objects[index];
    }
    static createNew() {
        return {
            index: 0,
            values: []
        };
    }
}

module.exports = Cache;
