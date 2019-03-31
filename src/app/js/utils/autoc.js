const crossCorrelation = (x, y, normalize = false, scaling = false) => {
    /*
              N-1
        c[i] = Σ x[n] * y[n-i]
              n=0
    */

    let c = [];
    const N = x.length;
    for (let i = -(y.length - 1); i < N; i++) {
        let sum = 0;
        for (let n = 0; n < N; ++n) {
            if (!isNaN(y[n - i])) {
                sum += x[n] * y[n - i];
            }
        }
        c.push(sum);
    }

    if (normalize || scaling) {
        const max = normalize ? Math.max(...c.map(n => Math.abs(n))) : 1;
        const scale = scaling ? Math.max(...x.map(n => Math.abs(n))) : 1;
        c = c.map(x => x / max * scale);
    }

    return c;
};

const autoCorrelation = (x, normalize = false, scaling = false) => {
    return crossCorrelation(x, x, normalize, scaling);
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        crossCorrelation,
        autoCorrelation,
    };
}
