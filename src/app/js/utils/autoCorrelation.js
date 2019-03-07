const autoCorrelation = (mx, my = undefined) => {
    my = my || mx;

    let matrix = [];
    for (let y of my.reverse()) {
        let row = [];
        for (let x of mx) {
            row.push(x * y);
        }
        matrix.push(row);
    }
 
    let getSum = (x, y) => {
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

exports.default = autoCorrelation;
