// Tabs
newTab.addEventListener('click', () => selectTab(0));
resultTab.addEventListener('click', () => selectTab(1));

databaseTab.addEventListener('click', () => {
    selectTab(2);
    if (databaseList.length == 0) {
        ipcRenderer.send('get-db-rows');
    }
    databasePatientInput.focus();
});
connectionTab.addEventListener('click', () => selectTab(3));
comparisonTab.addEventListener('click', () => selectTab(4));

// New
newBackButton.addEventListener('click', () => {
    if (currentStep != 0) {
        steps.previous_step();
    }
});
newNextButton.addEventListener('click', () => {
    if (currentStep != 3) {
        steps.next_step();
    }
});
newStart1Button.addEventListener('click', () => {
    ipcRenderer.send('start-measurement');
});
newStart2Button.addEventListener('click', () => {
    ipcRenderer.send('start-measurement');
});

comparisonTab.addEventListener('click', () => {
    if (count % 2 > 0 ||count == 0) {
        alert("You did not select two measurements for a comparison");
        
    }
});

newReturnButton.addEventListener('click', () => {
    selectTab(2);
});

newViewResultButton.addEventListener('click', () => {
    if (!newViewResultButton.hasAttribute('disabled')) {
        let data = getMeasurementData();
        databaseList = [];
        ipcRenderer.send('save-data', data);
        selectTab(1);
        renderResult(data);
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
