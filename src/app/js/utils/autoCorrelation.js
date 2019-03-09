const autoCorrelation = (x, normalize = false, scaling = false) => {
    /*
              N-1
        c[i] = Σ x[n] * x[n-i]
              n=0
    */

    let c = [];
    const N = x.length;
    for (let i = 0; i < N; i++) {
        let sum = 0;
        for (let n = 0; n < N; ++n) {
            if (!isNaN(x[n - i])) {
                sum += x[n] * x[n - i];
            }
        }
        c.push(sum);
    }

    let result = [...c].slice(1);
    result = [...c.reverse(), ...result];

    if (normalize || scaling) {
        const max = normalize ? Math.max(...result) : 1;
        const scale = scaling ? Math.max(...x) : 1;
        result = result.map(x => x / max * scale);
    }

    return result;
};

//console.log(autoCorrelation([1, 2, 3, 4]), 'should be the same as', [4, 11, 20, 30, 20, 11, 4]);

module.exports = autoCorrelation;
