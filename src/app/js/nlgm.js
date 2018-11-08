const { ipcRenderer } = require('electron');
const bulmaSteps = require('bulma-steps');

// Tabs
const newTab = document.querySelector('#new-tab');
const resultTab = document.querySelector('#result-tab');
const databaseTab = document.querySelector('#database-tab');
const connectionTab = document.querySelector('#connection-tab');

const newView = document.querySelector('#new');
const resultView = document.querySelector('#result');
const databaseView = document.querySelector('#database');
const connectionView = document.querySelector('#connection');

// New
new bulmaSteps(document.querySelector('#new-steps'), {
    onShow: (id) => console.log(id)
});

// Result
const resultPlot = document.querySelector('#view-plot');

const patientInput = document.querySelector('#patient-input');
const lengthOneInput = document.querySelector('#length-1-input');
const lengthTwoInput = document.querySelector('#length-2-input');

const warningModal = document.querySelector('#warning-modal');
const saveButton = document.querySelector('#save-btn');
const newButton = document.querySelector('#new-btn');
const modalNewButton = document.querySelector('#modal-new-btn');
const modalCancelButton = document.querySelector('#modal-cancel-btn');
const modalBackground = document.querySelector('#modal-bg');

// Database
const databaseTable = document.querySelector('#database-table');

// Connection
const portName = document.querySelector('#port-name');
const portId = document.querySelector('#port-id');
const portManufacturer = document.querySelector('#port-manufacturer');
const connectButton = document.querySelector('#connect-btn');

// Handle tabs
const tabs = [
    { tab: newTab, div: newView },
    { tab: resultTab, div: resultView },
    { tab: databaseTab, div: databaseView },
    { tab: connectionTab, div: connectionView }
];
let selectTab = (index) => {
    // Select tab & show div
    let selected = tabs[index];
    selected.tab.setAttribute('class', 'is-active');
    selected.div.removeAttribute('class');
    // Unselect and hide others
    for (let unselected of tabs) {
        if (unselected == selected) {
            continue;
        }
        unselected.tab.removeAttribute('class');
        unselected.div.setAttribute('class', 'hidden');
    }
};

newTab.addEventListener('click', () => selectTab(0));
resultTab.addEventListener('click', () => selectTab(1));
databaseTab.addEventListener('click', () => selectTab(2));
connectionTab.addEventListener('click', () => selectTab(3));

// Plot stuff
var lines = undefined;
var plotLayout = {
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

var addToresultPlot = (index) => {
    selectTab(tabs[0], [tabs[1], tabs[2]]);
    clearPlot();
    if (list.length > 0 && index <= list.length) {
        let data = list[index].data;
        addToPlot(data.m1, 100, 'm1');
        addToPlot(data.m2, 100, 'm2');
    }
    renderPlot();
};
var addToPlot = (data, length, legend) => {
    lines.push({
        y: data,
        x: Array.from({ length: length }, (_, i) => i),
        line: {
            shape: 'spline'
        },
        name: legend
    });
};
var clearPlot = () => {
    lines = [];
};
var renderPlot = () => {
    Plotly.newPlot(resultPlot, lines, plotLayout, { responsive: true, displayModeBar: false });
};

clearPlot();
renderPlot();

// Modal
let showModal = () => {
    warningModal.setAttribute('class', 'modal is-active');
};
let hideModal = () => {
    warningModal.setAttribute('class', 'modal');
};

//newButton.addEventListener('click', showModal);
modalCancelButton.addEventListener('click', hideModal);
modalBackground.addEventListener('click', hideModal);

// Database table
var list = [];
var renderTable = () => {
    databaseTable.innerHTML = '';

    for (let index = 0; index < list.length; ++index) {
        let item = list[index];

        let id = document.createElement('td');
        let date = document.createElement('td');
        let patient = document.createElement('td');
        let result = document.createElement('td');
        let button = document.createElement('td');

        id.innerHTML = item.id;
        date.innerHTML = item.date;
        patient.innerHTML = item.patient;
        result.innerHTML = '0 m/s';
        button.innerHTML = `<a class="button is-primary">View</a>`;
        button.setAttribute('onclick', `addToresultPlot(${index})`);

        let row = document.createElement('tr');
        row.appendChild(id);
        row.appendChild(date);
        row.appendChild(patient);
        row.appendChild(result);
        row.appendChild(button);

        databaseTable.appendChild(row);
    }
};

// Connection table
let renderConnected = (info) => {
    portName.innerHTML = info.name;
    portId.innerHTML = info.id;
    portManufacturer.innerHTML = info.mf;
    connectButton.setAttribute('class', 'button is-success');
    connectButton.setAttribute('disabled');
    connectButton.innerHTML = 'Connected';
};
let renderNotConnected = () => {
    portName.innerHTML = portId.innerHTML = portManufacturer.innerHTML = 'Not connected';
    connectButton.setAttribute('class', 'button is-danger');
    connectButton.innerHTML = 'Connect';
};
let renderPortInfo = (port) => {
    if (port.isConnected) {
        renderConnected(port.info);
    } else {
        renderNotConnected();
    }
};

renderNotConnected();

databaseTab.addEventListener('click', () => {
    list = [];
    ipcRenderer.send('request-data');
});

ipcRenderer.on('data-row-request', (_, data) => {
    data.data = JSON.parse(data.data);
    list.push(data);
    renderTable();
});

ipcRenderer.on('port-info-request', (_, port) => {
    setTimeout(() => renderPortInfo(port), 1000);
});

// Handle connection
connectButton.addEventListener('click', () => {
    connectButton.classList.add('is-loading');
    ipcRenderer.send('port-info');
});

ipcRenderer.on('port-closed', () => {
    renderNotConnected();
});
