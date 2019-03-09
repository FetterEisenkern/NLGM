
var resultLines = undefined;
var resultPlotLayout = {
    xaxis: {
        title: 'Time [us]',
    },
    yaxis: {
        title: 'Volt [mV]',
    },
    margin: {
        t: 0
    }
};

var addDataResult = (data) => {
    resultResult.textContent = ((data.data.result) ? data.data.result.toFixed(2) : '0.00') + ' m/s';
    resultName.textContent = data.getName();
    resultDate.textContent = (data.date) ? data.date : 'Recently';
    selectResult(data.data.result);
    addLinesToResultPlot(data.data.m1, 'm1');
    addLinesToResultPlot(data.data.m2, 'm2');
    if (optAutocorrelationCheckbox.checked) {
        addLinesToResultPlot(data.data.m1, 'm1 (ac)', true);
        addLinesToResultPlot(data.data.m2, 'm2 (ac)', true);
    }
};

var selectResult = (result) => {
    if (result !== undefined) {
        for (let tr of resultTable.children) {
            tr.removeAttribute('class');
        }

        if (result >= 60 && result <= 120) {
            resultTable.children[0].setAttribute('class', 'is-selected');
        } else if (result >= 40 && result <= 90) {
            resultTable.children[1].setAttribute('class', 'is-selected');
        } else if (result >= 20 && result <= 50) {
            resultTable.children[2].setAttribute('class', 'is-selected');
        } else if (result >= 10 && result <= 30) {
            resultTable.children[3].setAttribute('class', 'is-selected');
        } else if (result >= 5 && result <= 20) {
            resultTable.children[4].setAttribute('class', 'is-selected');
        } else if (result >= 0.5 && result <= 2) {
            resultTable.children[5].setAttribute('class', 'is-selected');
        }
    }
};

var addLinesToResultPlot = (data, legend, ac = false) => {
    // Mapping
    let voltage = [];
    let time = [];
    for (let point of data) {
        voltage.push(point.volt);
        time.push(point.ms);
    }

    if (ac) {
        voltage = autoCorrelation(voltage, true, true);
        let temp = [...voltage].slice(1);
        voltage = [...voltage.reverse(), ...temp];

        // Rewrite time
        const max = time.length;
        let t = -max;
        time = [];
        while (t < max) {
            time.push(++t);
        }
    }

    resultLines.push({
        y: voltage,
        x: time,
        line: {
            shape: 'spline', // "linear" | "spline" | "hv" | "vh" | "hvh" | "vhv"
            //smoothing: 0
        },
        mode: 'lines+markers',
        marker: {
            symbol: 'circle'
        },
        name: legend,
        visible: ac ? "legendonly" : true
    });
};

var clearResult = () => {
    resultResult.textContent = '0.00 m/s';
    resultName.textContent = '-';
    resultDate.textContent = '-';
    resultLines = [];
};

var renderResultPlot = () => {
    Plotly.newPlot(resultPlot, resultLines, resultPlotLayout, { responsive: true, displayModeBar: false });
};

var renderResult = (data = undefined) => {
    clearResult();
    if (data) {
        addDataResult(data);
    }
    renderResultPlot();
};

renderResult();
