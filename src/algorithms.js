class Algorithms {
    // [ { value: 0, time: 0 } ]
    static findMaximum(array) {
        let max = array[0];
        for (let point of array) {
            if (point.value > max.value) {
                max = point;
            }
        }
        return max;
    }
    // velocity = Math.abs(l1 - l2) / Algorithms.getTimeDelta(m1, m2);
    static getTimeDelta(m1, m2) {
        return Math.abs(Algorithms.findMaximum(m1).time - Algorithms.findMaximum(m2).time);
    }
}

module.exports = Algorithms;
