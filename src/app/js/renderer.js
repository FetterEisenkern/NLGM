const { ipcRenderer } = require('electron');

const title = document.querySelector('#title');
const table = document.querySelector('#table');
const plot = document.querySelector('#dataPlot');

/* ipcRenderer.on('alice', (ev, ...args) => {
    console.log(args[0]);
}); */

var lines = undefined;

var plotLayout = {
    margin: {
        t: 0
    }
};

var updatePlot = (index) => {
    clearPlot();
    if (list.length > 0 && index <= list.length) {
        let data = list[index].data;
        addToPlot(data.m1, 100);
        addToPlot(data.m2, 100);
    }
    renderPlot();
};
var addToPlot = (data, length) => {
    lines.push({
        y: data,
        x: Array.from({ length: length }, (_, i) => i),
        line: {
            shape: 'spline'
        }
    });
};
var clearPlot = () => {
    lines = [];
};
var renderPlot = () => {
    Plotly.newPlot(plot, lines, plotLayout, { displayModeBar: false });
};

clearPlot();
renderPlot();

var list = [];
var renderTable = () => {
    table.innerHTML = '';

    for (let index = 0; index < list.length; ++index) {
        let item = list[index];

        let id = document.createElement('td');
        let date = document.createElement('td');
        let patient = document.createElement('td');
        let data = document.createElement('td');

        id.innerHTML = item.id;
        date.innerHTML = item.date;
        patient.innerHTML = item.patient;
        data.innerHTML = JSON.stringify(item.data);

        let row = document.createElement('tr');
        row.setAttribute('onclick', `updatePlot(${index})`);

        row.appendChild(id);
        row.appendChild(date);
        row.appendChild(patient);
        row.appendChild(data);

        table.appendChild(row);
    }
};

title.addEventListener('click', () => {
    list = [];
    ipcRenderer.send('request-data');
});

ipcRenderer.on('data-row-request', (_, data) => {
    data.data = JSON.parse(data.data);
    list.push(data);
    renderTable();
});
