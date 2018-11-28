const { ipcRenderer } = require('electron');

// New
ipcRenderer.on('measurement', (_, data) => {
    renderMeasurement(data);
});
// Database
ipcRenderer.on('db-row', (_, data) => {
    data.data = JSON.parse(data.data);
    databaseList.push(data);
    renderTable();
});

// Connection
ipcRenderer.on('port-info', (_, port) => {
    setTimeout(() => renderPortInfo(port.info), 1000);
});
ipcRenderer.on('port-closed', () => {
    renderNotConnected();
});

// Request data
ipcRenderer.send('get-db-rows');
ipcRenderer.send('get-port-info');
