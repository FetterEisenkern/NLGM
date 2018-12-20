// Tabs
newTab.addEventListener('click', () => selectTab(0));
resultTab.addEventListener('click', () => selectTab(1));
databaseTab.addEventListener('click', () => {
    selectTab(2);
    if (refreshList) {
        ipcRenderer.send('get-db-rows');
        refreshList = false;
    }
    databasePatientInput.focus();
});
connectionTab.addEventListener('click', () => selectTab(3));

// New
newBackButton.addEventListener('click', () => {
    gotoPreviousStep();
});
newNextButton.addEventListener('click', () => {
    gotoNextStep();
});
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

databasePatientInput.addEventListener('input', () => {
    filter.name = (databasePatientInput.value.length != 0) ? databasePatientInput.value : undefined;
    renderList();
});
databaseResultInput.addEventListener('input', () => {
    filter.result = (databaseResultInput.value.length != 0) ? databaseResultInput.value : undefined;
    renderList();
});
databaseIdInput.addEventListener('input', () => {
    filter.id = (databaseIdInput.value.length != 0) ? databaseIdInput.value : undefined;
    renderList();

});
databaseDateInput.addEventListener('input', () => {
    filter.date = (databaseDateInput.value.length != 0) ? databaseDateInput.value : undefined;
    renderList();
});
