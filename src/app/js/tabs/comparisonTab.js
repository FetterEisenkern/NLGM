var name1, id1, result1, date1;
var name2, id2, result2, date2;
var row1, row2, row3, row4;

let compare = (index1, index2) => {
    // add values to the cells
    name1.innerHTML = index1.getName();
    id1.innerHTML = index1.id;
    result1.innerHTML = index1.data.result.toFixed(2) + " m/s";
    date1.innerHTML = index1.date;

    name2.innerHTML = index2.getName();
    id2.innerHTML = index2.id;
    result2.innerHTML = index2.data.result.toFixed(2) + " m/s";
    date2.innerHTML = index2.date;
};

let comparisonPage = 0;
let maxComparisonPage = 1;

let changeComparisonPage = () => {
    comparisonPage++;
    if (comparisonPage > maxComparisonPage) {
        comparisonPage = 0;
    }

    if (comparisonPage == 0) {
        comparisonPlot.setAttribute('class', 'hidden');
        comparisonTable.setAttribute('class', 'table is-hoverable is-fullwidth');
        comparisonPageButton.innerHTML = 'Graph';
    } else if (comparisonPage == 1) {
        comparisonPlot.removeAttribute('class');
        comparisonTable.setAttribute('class', 'table is-hoverable is-fullwidth hidden');
        comparisonPageButton.innerHTML = 'Table';
        addLinesToComparisonPlot(data, 'm1');
        addLinesToComparisonPlot(data, 'm2');
        addLinesToComparisonPlot(data, 'm3');
        addLinesToComparisonPlot(data, 'm4');
    } else {
        console.error('Invalid comparison page index!');
    }
    renderComparisonPlot();
};

var comparisonLines = [];

var comparisonPlotLayout = {
    xaxis: {
        title: 'Time [ms]',
    },
    yaxis: {
        title: 'Volt [mV]',
    },
    margin: {
        t: 0
    },
    width: 720,
    height: 350
};

var addLinesToComparisonPlot = (data, legend) => {
    // Mapping
    let voltage = [];
    let time = [];
    for (let point of data) {
        voltage.push(point.volt);
        time.push(point.ms);
    }

    comparisonLines.push({
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
        name: legend
    });
};

var renderComparisonPlot = () => {
    Plotly.newPlot(comparisonPlot, comparisonLines, comparisonPlotLayout, { responsive: false, displayModeBar: false });
};

let init = () => {
    row1 = document.getElementById('row1');
    row2 = document.getElementById('row2');
    row3 = document.getElementById('row3');
    row4 = document.getElementById('row4');

    name1 = row1.insertCell(1);
    name2 = row1.insertCell(2);
    id1 = row2.insertCell(1);
    id2 = row2.insertCell(2);
    result1 = row3.insertCell(1);
    result2 = row3.insertCell(2);
    date1 = row4.insertCell(1);
    date2 = row4.insertCell(2);
};

init();
