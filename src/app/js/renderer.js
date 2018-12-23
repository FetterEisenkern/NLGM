const { ipcRenderer } = require('electron');

// New
ipcRenderer.on('measurement-success', (_, data) => {
    renderMeasurement(data);
});
ipcRenderer.on('measurement-error', () => {
    // TODO: error modal
});

// Database
ipcRenderer.on('db-data-row', (_, row) => {
    row.data = JSON.parse(row.data);
    row.getName = function () { return this.firstName + ' ' + this.lastName };
    databaseList.push(row);
    renderList();
});
ipcRenderer.on('db-patient-row', (_, row) => {
    row.getName = function () { return this.firstName + ' ' + this.lastName };
    patientList.push(row);
    renderList();
});

// Connection
ipcRenderer.on('port-info', (_, port) => {
    setTimeout(() => renderPortInfo(port.info), 1000);
});
ipcRenderer.on('port-close', () => {
    renderNotConnected();
});

// Request data
ipcRenderer.send('get-data-rows');
ipcRenderer.send('get-patient-rows');
ipcRenderer.send('get-port-info');
