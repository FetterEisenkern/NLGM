const { ipcRenderer } = require('electron');

// New
ipcRenderer.on('measurement-success', (_, data) => {
    renderMeasurement(data);
});
ipcRenderer.on('measurement-error', () => {
    // TODO
});

// Database
ipcRenderer.on('db-row', (_, row) => {
    row.data = JSON.parse(row.data);
    databaseList.push(row);
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
ipcRenderer.send('get-db-rows');
ipcRenderer.send('get-port-info');
