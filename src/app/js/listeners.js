// Tabs
newTab.addEventListener('click', () => selectTab(0));
resultTab.addEventListener('click', () => selectTab(1));
databaseTab.addEventListener('click', () => {
    selectTab(2)
    if (refreshList) {
        ipcRenderer.send('get-db-rows');
        refreshList = false;
    }
});
connectionTab.addEventListener('click', () => selectTab(3));

// New
newStart1Button.addEventListener('click', () => {
    ipcRenderer.send('start-measurement');
});
newStart2Button.addEventListener('click', () => {
    ipcRenderer.send('start-measurement');
});
newViewResultButton.addEventListener('click', () => {
    if (!newViewResultButton.hasAttribute('disabled')) {
        let data = getMeasurementData();
        ipcRenderer.send('save-data', data);
        selectTab(1);
        renderResult(data);
        refreshList = true;
        resetMeasurement();
    }
});

// Connection
conConnectButton.addEventListener('click', (ev) => {
    if (!conConnectButton.hasAttribute('disabled')) {
        conConnectButton.classList.add('is-loading');
        ipcRenderer.send('get-port-info');
    }
});
