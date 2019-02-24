var currentPatientMeasurements = [];

var renderPatientModal = (patient) => {
    patientModalTitle.innerHTML = patient.getName();

    currentPatientMeasurements = databaseList.filter(x => x.patient == patient.patient);

    patientModalStatsTotal.innerHTML = currentPatientMeasurements.length;

    if (currentPatientMeasurements.length != 0) {
        patientModalStatsBest.innerHTML = currentPatientMeasurements.map(m => m.data.result).reduce((a, b) => Math.max(a, b)).toFixed(2);
        patientModalStatsWorst.innerHTML = currentPatientMeasurements.map(m => m.data.result).reduce((a, b) => Math.min(a, b)).toFixed(2);
        patientModalStatsMostRecent.innerHTML = currentPatientMeasurements.sort((a, b) => a.id < b.id)[0].data.result.toFixed(2);
    } else {
        patientModalStatsBest.innerHTML = '-';
        patientModalStatsWorst.innerHTML = '-';
        patientModalStatsMostRecent.innerHTML = '-';
    }

    renderPatientModalTable();

    patientModal.setAttribute('class', 'modal is-active');
};
var renderPatientModalTable = (currentPage = 1) => {
    patientModalTable.innerHTML = '';

    let paginatorPages = 0;
    let rowsPerPage = 20;

    for (let index = 0; index < currentPatientMeasurements.length; ++index) {
        if (index % rowsPerPage == 0) {
            ++paginatorPages;
        }

        if (paginatorPages != currentPage) {
            continue;
        }

        let item = currentPatientMeasurements[index];

        let date = document.createElement('td');
        let result = document.createElement('td');
        let actions = document.createElement('td');

        date.innerHTML = item.date;
        result.innerHTML = ((item.data.result) ? item.data.result.toFixed(2) : '0.00') + ' m/s';
        actions.innerHTML = `<div class="field is-grouped">
                <p class="control">
                    <a class="button is-small is-primary is-outlined" onclick="addToResultPlotFromModal(${index})">
                        View
                    </a>
                </p>
            </div>`;

        let row = document.createElement('tr');
        row.appendChild(date);
        row.appendChild(result);
        row.appendChild(actions);

        patientModalTable.appendChild(row);
    }

    patientModalPaginator.innerHTML = '';

    for (let i = 1; i <= paginatorPages; ++i) {
        let link = document.createElement('a');
        link.setAttribute('class', (i == currentPage) ? 'pagination-link is-current' : 'pagination-link');
        link.setAttribute('onclick', `renderPatientModalTable(${i});`);
        link.innerHTML = i;

        let item = document.createElement('li');
        item.appendChild(link);
        patientModalPaginator.appendChild(item);
    }
};
var addToResultPlotFromModal = (index) => {
    selectTab(1, true, () => {
        closePatientModal();
        renderResult(currentPatientMeasurements[index]);
    });
};
var closePatientModal = () => {
    patientModal.setAttribute('class', 'modal');
};
