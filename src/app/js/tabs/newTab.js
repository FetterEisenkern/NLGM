const bulmaSteps = require('bulma-steps');

new bulmaSteps(newSteps, {
    onShow: (id) => console.log(`step: ${id}`)
});

var m1Lines = undefined;
var m2Lines = undefined;

var newPlotLayout = {
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

var addToNewPlot = (lines, data, length, legend) => {
    lines.push({
        y: data,
        x: Array.from({ length: length }, (_, i) => i),
        line: {
            shape: 'spline'
        },
        name: legend
    });
};

var clearNewPlots = () => {
    m1Lines = [];
    m2Lines = [];
};

var renderNewPlots = () => {
    Plotly.newPlot(newPlot1, m1Lines, newPlotLayout, { responsive: true, displayModeBar: false });
    Plotly.newPlot(newPlot2, m2Lines, newPlotLayout, { responsive: true, displayModeBar: false });
};

clearNewPlots();
renderNewPlots();
