class Cache {
    constructor() {
        this.objects = [];
        this.curObject = Cache.createNew();
    }
    add(data) {
        this.curObject.values[this.curObject.index].push(data);
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
