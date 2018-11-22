const { ipcRenderer } = require('electron');

// Database
ipcRenderer.on('db-row', (_, data) => {
    data.data = JSON.parse(data.data);
    list.push(data);
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
