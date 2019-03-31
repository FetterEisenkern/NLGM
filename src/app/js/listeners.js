// Tabs
newTab.addEventListener('click', () => selectTab(0));
resultTab.addEventListener('click', () => selectTab(1));

databaseTab.addEventListener('click', () => {
    selectTab(2);
    if (databaseList.length === 0) {
        ipcRenderer.send('get-db-rows');
    }
    databasePatientInput.focus();
});
comparisonTab.addEventListener('click', () => selectTab(3));
optionsTab.addEventListener('click', () => selectTab(4));

// New
newBackButton.addEventListener('click', () => {
    if (currentStep !== 0) {
        steps.previous_step();
    }
});
newNextButton.addEventListener('click', () => {
    if (currentStep !== 3) {
        steps.next_step();
    }
});
newPatientLookUpButton.addEventListener('click', () => {
    if (currentPatient === undefined) {
        renderPatientDatabase();
        newPatientLookUpModal.setAttribute('class', 'modal is-active');
    } else {
        currentPatient = undefined;
        newPatientFirstNameInput.removeAttribute('disabled');
        newPatientLastNameInput.removeAttribute('disabled');
        newPatientDateOfBirthInput.removeAttribute('disabled');
        newPatientLookUpButton.innerHTML = `
            <span class="icon is-small">
                <i class="fas fa-search"></i>
            </span>
            <span>Search Patient</span>`;
    }
});
newStart1Button.addEventListener('click', () => {
    if (m1Lines.length === 0) {
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
    if (m2Lines.length === 0) {
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

/* comparisonTab.addEventListener('click', () => {
    if (count % 2 > 0 || count === 0) {
        alert("You did not select two measurements for a comparison");
    }
}); */

comparisonReturnButton.addEventListener('click', () => {
    selectTab(2);
});
comparisonPageButton.addEventListener('click', () => {
    changeComparisonPage(comparisonPage + 1);
});

newViewResultButton.addEventListener('click', () => {
    if (!newViewResultButton.hasAttribute('disabled')) {
        let data = getMeasurementData();
        databaseList = [];
        patientList = [];
        ipcRenderer.send('save-data', data);
        selectTab(1, true, () => {
            renderResult(data);
            resetMeasurement();
        });
    }
});

// Database
databasePatientInput.addEventListener('input', () => {
    filter.name = (databasePatientInput.value.length !== 0) ? databasePatientInput.value : undefined;
    renderList();
});
databaseResultInput.addEventListener('input', () => {
    filter.result = (databaseResultInput.value.length !== 0) ? databaseResultInput.value : undefined;
    renderList();
});
databaseIdInput.addEventListener('input', () => {
    filter.id = (databaseIdInput.value.length !== 0) ? databaseIdInput.value : undefined;
    renderList();
});
databaseDateInput.addEventListener('input', () => {
    filter.date = (databaseDateInput.value.length !== 0) ? databaseDateInput.value : undefined;
    renderList();
});
databaseSorter.addEventListener('change', () => {
    sortList(databaseSorter.selectedIndex);
});

// Options
conConnectButton.addEventListener('click', () => {
    if (!conConnectButton.hasAttribute('disabled')) {
        conConnectButton.classList.add('is-loading');
        ipcRenderer.send('get-port-info');
    }
});
conConnectToCloudButton.addEventListener('click', () => {
    if (!conConnectToCloudButton.hasAttribute('disabled')) {
        conConnectToCloudButton.classList.add('is-loading');
        ipcRenderer.send('connect-to-cloud', {
            host: conConnectToCloudHost.value,
            user: conConnectToCloudUser.value,
            password: conConnectToCloudPassword.value
        });
    }
});

// Global
document.addEventListener('keyup', (ev) => {
    if (ev.ctrlKey && ev.keyCode === 37) {
        selectTab(currentTab - 1);
    } else if (ev.ctrlKey && ev.keyCode === 39) {
        selectTab(currentTab + 1);
    } else if (ev.keyCode === 27) {
        closeErrorModal();
        closePatientModal();
        closePatientDatabase();
    }
});
