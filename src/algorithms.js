class Algorithms {
    static findMaximum(array) {
        let max = 0;
        for (let num of array) {
            if (num > max) {
                max = num;
            }
        }
        return max;
    }
}

module.exports = Algorithms;
