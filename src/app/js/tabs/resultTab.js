
var resultLines = undefined;
var resultPlotLayout = {
    xaxis: {
        title: 'Time [ms]',
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
    addLinesToResultPlot(data.data.m1, 'm1');
    addLinesToResultPlot(data.data.m2, 'm2');
};

var addLinesToResultPlot = (data, legend) => {
    // Mapping
    let voltage = [];
    let time = [];
    for (let point of data) {
        voltage.push(point.volt);
        time.push(point.ms);
    }

    resultLines.push({
        y: voltage,
        x: time,
        line: {
            shape: 'linear', // "linear" | "spline" | "hv" | "vh" | "hvh" | "vhv"
            //smoothing: 0
        },
        mode: 'lines+markers',
        marker: {
            symbol: 'circle'
        },
        name: legend
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
