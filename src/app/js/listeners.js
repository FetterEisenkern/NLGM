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
    if (m1Lines.length == 0) {
        newStart1Button.innerHTML = '<span>Reset</span>';
        newStart1Button.setAttribute('class', 'button is-danger');
        ipcRenderer.send('start-measurement');
    } else {
        m1Lines = [];
        renderNewPlot1();
        newStart1Button.innerHTML = '<span>Start</span>';
        newStart1Button.setAttribute('class', 'button is-success');
    }
});
newStart2Button.addEventListener('click', () => {
    if (m2Lines.length == 0) {
        newStart2Button.innerHTML = '<span>Reset</span>';
        newStart2Button.setAttribute('class', 'button is-danger');
        ipcRenderer.send('start-measurement');
    } else {
        m2Lines = [];
        renderNewPlot2();
        newStart2Button.innerHTML = '<span>Start</span>';
        newStart2Button.setAttribute('class', 'button is-success');
    }
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

// Database
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

// Connection
conConnectButton.addEventListener('click', () => {
    if (!conConnectButton.hasAttribute('disabled')) {
        conConnectButton.classList.add('is-loading');
        ipcRenderer.send('get-port-info');
    }
});

// Global
document.addEventListener('keyup', (ev) => {
    if (ev.ctrlKey && ev.keyCode == 37) {
        selectTab(currentTab - 1);
    } else if (ev.ctrlKey && ev.keyCode == 39) {
        selectTab(currentTab + 1);
    }
});
