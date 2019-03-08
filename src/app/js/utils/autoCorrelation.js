const autoCorrelation = (a1, a2 = undefined) => {
    let mx = [...a1];
    let my = (a2) ? [...a2] : [...a1];

    let matrix = [];
    for (let y of my.reverse()) {
        let row = [];
        for (let x of mx) {
            row.push(x * y);
        }
        matrix.push(row);
    }
 
    const getSum = (x, y) => {
        let sum = 0;
        while (x < matrix.length && y >= 0) {
            sum += matrix[x++][y--];
        }
        return sum;
    };

    const xx = 0;
    const yy = matrix[0].length - 1;

    let result = [];
    for (let x = 0; x < matrix.length; ++x) {
        for (let y = 0; y < matrix[x].length; ++y) {
            if (x == xx || y == yy) {
                result.push(getSum(x, y));
            }
        }
    }
    return result;
};

/* const test = autoCorrelation([1, 2, 3, 4]);
const test2 = autoCorrelation([1, 2, 3, 4], [1, 2, 3, 4]);
console.log(test, 'and', test2, 'should be the same as', [4, 11, 20, 30, 20, 11, 4]); */

module.exports = autoCorrelation;
