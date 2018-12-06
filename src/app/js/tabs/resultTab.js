
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

var addDataToResultPlot = (data) => {
    addLinesToResultPlot(data.m1, 100, 'm1');
    addLinesToResultPlot(data.m2, 100, 'm2');
};

var addLinesToResultPlot = (data, length, legend) => {
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
            shape: 'spline'
        },
        name: legend
    });
};

var clearResultPlot = () => {
    resultLines = [];
};

var renderResultPlot = () => {
    Plotly.newPlot(resultPlot, resultLines, resultPlotLayout, { responsive: true, displayModeBar: false });
};

clearResultPlot();
renderResultPlot();
