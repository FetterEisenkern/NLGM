const autoCorrelation = (a1, a2 = undefined) => {
    /*
        Mult-matrix:

              1 2  3  4 mx
            4 4 8 12 16
            3 3 6  9 12
            2 2 4  6  8
            1 1 2  3  4
            my
    */

    let matrix = [];
    {
        const mx = a1; // No copy for optimization
        const my = [...(a2 ? a2 : a1)].reverse();
        for (let y of my) {
            let row = [];
            for (let x of mx) {
                row.push(x * y);
            }
            matrix.push(row);
        }
    }

    /*
        Sum every step:

            4 8 12  . x
            3 6  . 12
            2 .  6  8
            . 2  3  4
            y

            matrix[down][left] 
            matrix[y+1][x-1]
    */

    const getSum = (y, x) => {
        let sum = 0;
        while (y < matrix.length && x >= 0) {
            sum += matrix[y++][x--];
        }
        return sum;
    };

    /*
        Targets:

            . . . .
            3 6 9 .
            2 4 6 .
            1 2 3 .

            matrix[0][x]
            matrix[y][maxx]
    */

    const maxx = matrix[0].length - 1;

    let result = [];
    for (let x = 0; x < maxx; ++x) {
        result.push(getSum(0, x));
    }
    for (let y = 0; y < matrix.length; ++y) {
        result.push(getSum(y, maxx));
    }

    return result;
};

/* const test = autoCorrelation([1, 2, 3, 4]);
const test2 = autoCorrelation([1, 2, 3, 4], [1, 2, 3, 4]);
console.log(test, 'and', test2, 'should be the same as', [4, 11, 20, 30, 20, 11, 4]); */

module.exports = autoCorrelation;
