const { ipcRenderer } = require('electron');

// New
ipcRenderer.on('measurement-success', (_, data) => {
    renderMeasurement(data);
});
ipcRenderer.on('measurement-error', () => {
    renderErrorModal(`
        <p>
            Measurement has timed out. Please make sure that a connection has been established between device and computer.<br>
            <br>
            Check the <a onclick="closeErrorModal();selectTab(4);">Options Tab</a> and retry.
        </p>`);
    if (m1Lines.length === 0) {
        newStart1Button.innerHTML = '<span>Start</span>';
        newStart1Button.setAttribute('class', 'button is-success');
    }
    if (m2Lines.length === 0) {
        newStart2Button.innerHTML = '<span>Start</span>';
        newStart2Button.setAttribute('class', 'button is-success');
    }
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
    renderPatientDatabase();
});

// Options
ipcRenderer.on('port-info', (_, port) => {
    setTimeout(() => renderPortInfo(port.info), 1000);
});
ipcRenderer.on('port-close', () => {
    renderNotConnected();
});
ipcRenderer.on('cloud-connected', () => {
    setTimeout(() => renderCloudConnected(), 1000);
});
ipcRenderer.on('cloud-not-connected', () => {
    setTimeout(() => renderCloudNotConnected(), 1000);
});

// Request data
ipcRenderer.send('get-data-rows');
ipcRenderer.send('get-patient-rows');
ipcRenderer.send('get-port-info');
