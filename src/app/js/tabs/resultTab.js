
var resultLines = undefined;
var resultPlotLayout = {
    xaxis: {
        title: 'Time [ms]',
    },
    yaxis: {
        title: 'Volt [V]',
    },
    margin: {
        t: 0
    }
};

var addToResultPlot = (index) => {
    selectTab(1);
    clearResultPlot();
    if (list.length > 0 && index <= list.length) {
        let data = list[index].data;
        addLinesToResultPlot(data.m1, 100, 'm1');
        addLinesToResultPlot(data.m2, 100, 'm2');
    }
    renderResultPlot();
};

var addLinesToResultPlot = (data, length, legend) => {
    resultLines.push({
        y: data,
        x: Array.from({ length: length }, (_, i) => i),
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
