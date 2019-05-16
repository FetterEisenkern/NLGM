const bulmaSteps = require('bulma-steps');
const bulmaCalendar = require('bulma-calendar');

var currentStep = 0;
const steps = new bulmaSteps(newSteps, {
    onShow: (id) => {
        switch (currentStep = id) {
            case 0:
                newBackButton.firstElementChild.setAttribute('class', 'step-button hidden');
                break;
            case 1:
                newBackButton.firstElementChild.setAttribute('class', 'step-button');
                renderNewPlot1();
                break;
            case 2:
                newNextButton.firstElementChild.setAttribute('class', 'step-button');
                renderNewPlot2();
                break;
            case 3:
                newNextButton.firstElementChild.setAttribute('class', 'step-button hidden');

                if (validateData()) {
                    newViewResultButton.setAttribute('class', 'button is-success');
                    newViewResultButton.removeAttribute('disabled');
                    newViewResultButton.removeAttribute('title');
                } else {
                    newViewResultButton.setAttribute('class', 'button is-danger');
                    newViewResultButton.setAttribute('disabled', '');
                    newViewResultButton.setAttribute('title', 'Data not complete!');
                }

                newResultPatient.innerHTML = (newPatientFirstNameInput.value !== '')
                    ? `${newPatientFirstNameInput.value} ${newPatientLastNameInput.value}`
                    : '-';
                newResultLengths.innerHTML = `${(newLength1Input.value !== '') ? parseInt(newLength1Input.value) : '0'}cm<br>`
                    + `${(newLength2Input.value !== '') ? parseInt(newLength2Input.value) : '0'}cm`;

                newResultMeasurements.innerHTML = (m1Data)
                    ? (m2Data)
                        ? 2
                        : 1
                    : (m2Data)
                        ? 1
                        : 0;
                break;
            default:
                break;
        }
    }
});

const calendar = new bulmaCalendar(newPatientDateOfBirthInput, { dateFormat: 'YYYY-MM-DD' });

var patientList = [];
var filteredPatientList = [];
var currentPatient = undefined;

var renderPatientDatabase = (currentPage = 1) => {
    if (newPatientFirstNameInput.value !== '' || newPatientLastNameInput.value !== '' || newPatientDateOfBirthInput.value !== '') {
        filteredPatientList = [];
        for (let item of patientList) {
            if (newPatientFirstNameInput.value !== '' && item.firstName.startsWith(newPatientFirstNameInput.value)
                || (newPatientLastNameInput.value !== '' && item.lastName.startsWith(newPatientLastNameInput.value))
                || (newPatientDateOfBirthInput.value !== '' && item.dateOfBirth.startsWith(newPatientDateOfBirthInput.value))) {
                filteredPatientList.push(item);
            }
        }
    } else {
        filteredPatientList = patientList;
    }

    newPatientTable.innerHTML = '';

    let paginatorPages = 0;
    let rowsPerPage = 10;

    for (let index = 0; index < filteredPatientList.length; ++index) {
        if (index % rowsPerPage === 0) {
            ++paginatorPages;
        }

        if (paginatorPages !== currentPage) {
            continue;
        }

        let item = filteredPatientList[index];

        let id = document.createElement('td');
        let first = document.createElement('td');
        let last = document.createElement('td');
        let birth = document.createElement('td');
        let actions = document.createElement('td');

        id.innerHTML = item.patientId;
        first.innerHTML = item.firstName;
        last.innerHTML = item.lastName;
        birth.innerHTML = item.dateOfBirth;
        actions.innerHTML = `<div class="field is-grouped">
                <p class="control">
                    <a class="button is-small is-primary is-outlined" onclick="selectPatient(${index})">
                        Select
                    </a>
                </p>
                <p class="control">
                    <a class="button is-small is-danger is-outlined" onclick="deletePatient(${index})">
                        Delete
                    </a>
                </p>
            </div>`;

        let row = document.createElement('tr');
        row.appendChild(id);
        row.appendChild(first);
        row.appendChild(last);
        row.appendChild(birth);
        row.appendChild(actions);

        newPatientTable.appendChild(row);
    }

    newPatientPaginator.innerHTML = '';

    for (let i = 1; i <= paginatorPages; ++i) {
        let link = document.createElement('a');
        link.setAttribute('class', (i === currentPage) ? 'pagination-link is-current' : 'pagination-link');
        link.setAttribute('onclick', `renderPatientDatabase(${i});`);
        link.innerHTML = i;

        let item = document.createElement('li');
        item.appendChild(link);
        newPatientPaginator.appendChild(item);
    }
};
var selectPatient = (index) => {
    currentPatient = filteredPatientList[index];
    newPatientFirstNameInput.value = currentPatient.firstName;
    newPatientLastNameInput.value = currentPatient.lastName;
    newPatientDateOfBirthInput.value = currentPatient.dateOfBirth;
    newPatientFirstNameInput.setAttribute('disabled', '');
    newPatientLastNameInput.setAttribute('disabled', '');
    newPatientDateOfBirthInput.setAttribute('disabled', '');
    newPatientLookUpButton.innerHTML = `
        <span class="icon is-small">
            <i class="fas fa-pen"></i>
        </span>
        <span>Edit</span>`;
    closePatientDatabase();
};
var deletePatient = (index) => {
    ipcRenderer.send('delete-patient', filteredPatientList[index].patientId);
    patientList = [];
    filteredPatientList = [];
    databaseList = [];
    filteredList = [];
};
var closePatientDatabase = () => {
    newPatientLookUpModal.setAttribute('class', 'modal');
};

var m1Data = [];
var m2Data = [];

var m1Lines = [];
var m2Lines = [];

var newPlotLayout = {
    xaxis: {
        title: 'Time [us]',
    },
    yaxis: {
        title: 'Volt [mV]',
        //range: [0, 1024] // TODO
    },
    margin: {
        t: 0
    },
    width: 720,
    height: 350
};

var addToNewPlot = (lines, data, legend) => {
    // Mapping
    let voltage = [];
    let time = [];
    for (let point of data) {
        voltage.push(point.mv);
        time.push(point.us);
    }

    lines.push({
        y: voltage,
        x: time,
        line: {
            shape: 'spline', // "linear" | "spline" | "hv" | "vh" | "hvh" | "vhv"
            //smoothing: 0
        },
        mode: 'lines',
        marker: {
            symbol: 'circle'
        },
        name: legend
    });
};

var renderNewPlot1 = () => {
    Plotly.newPlot(newPlot1, m1Lines, newPlotLayout, { responsive: false, displayModeBar: false });
};
var renderNewPlot2 = () => {
    Plotly.newPlot(newPlot2, m2Lines, newPlotLayout, { responsive: false, displayModeBar: false });
};

var validateData = () => {
    return newPatientFirstNameInput.value.length !== 0
        && newPatientLastNameInput.value.length !== 0
        && newPatientDateOfBirthInput.value.length !== 0
        && newLength1Input.value.length !== 0
        && newLength2Input.value.length !== 0
        && parseInt(newLength1Input.value) !== parseInt(newLength2Input.value)
        && m1Lines.length !== 0
        && m2Lines.length !== 0;
};

var getMeasurementData = () => {
    let measurement = {
        id: -1,
        date: undefined,
        patient: {
            id: (currentPatient) ? currentPatient.patientId : undefined,
            firstName: newPatientFirstNameInput.value,
            lastName: newPatientLastNameInput.value,
            dateOfBirth: newPatientDateOfBirthInput.value
        },
        data: {
            l1: parseInt(newLength1Input.value),
            l2: parseInt(newLength2Input.value),
            m1: m1Data,
            m2: m2Data,
            result: undefined
        },
        getName() {
            return this.patient.firstName + ' ' + this.patient.lastName;
        }
    };
    measurement.data.result = calculateResult(measurement.data);
    return measurement;
};

var calculateResult = (data) => {
    let findMaximum = (points) => {
        let max = points[0];
        for (let point of points) {
            if (point.mv > max.mv) {
                max = point;
            }
        }
        return max;
    };

    /*
               | l1 - l2 |
        v = -----------------
            | tmax1 - tmax2 |
    */

    let tmax1 = findMaximum(data.m1).us / 1000000; // us -> s
    let tmax2 = findMaximum(data.m2).us / 1000000; // us -> s
    let l1 = data.l1 / 100; // cm -> m
    let l2 = data.l2 / 100; // cm -> m
    let deltaLength = Math.abs(l1 - l2);
    let deltaTime = Math.abs(tmax1 - tmax2);
    console.log(tmax1, tmax2, l1, l2, deltaLength, deltaTime);
    return (deltaTime !== 0) ? deltaLength / deltaTime : 0;
};

var renderMeasurement = (data) => {
    if (currentStep === 1) {
        m1Lines = [];
        addToNewPlot(m1Lines, m1Data = data.m1, 'm1');
        renderNewPlot1();
    } else if (currentStep === 2) {
        m2Lines = [];
        addToNewPlot(m2Lines, m2Data = data.m2, 'm2');
        renderNewPlot2();
    } else {
        console.error('Unable to render measurement!');
    }
};

var resetMeasurement = () => {
    if (currentStep === 3) {
        steps.previous_step();
        steps.previous_step();
        steps.previous_step();
    }
    newPatientFirstNameInput.value = '';
    newPatientLastNameInput.value = '';
    newPatientDateOfBirthInput.value = '';
    currentPatient = undefined;
    newPatientFirstNameInput.removeAttribute('disabled');
    newPatientLastNameInput.removeAttribute('disabled');
    newPatientDateOfBirthInput.removeAttribute('disabled');
    newPatientLookUpButton.innerHTML = `
            <span class="icon is-small">
                <i class="fas fa-search"></i>
            </span>
            <span>Search Patient</span>`;
    newLength1Input.value = '';
    newLength2Input.value = '';
    m1Data = undefined;
    m2Data = undefined;
    m1Lines = [];
    m2Lines = [];
    newStart1Button.innerHTML = '<span>Start</span>';
    newStart1Button.setAttribute('class', 'button is-success');
    newStart2Button.innerHTML = '<span>Start</span>';
    newStart2Button.setAttribute('class', 'button is-success');
    renderNewPlot1();
    renderNewPlot2();
};

//resetMeasurement();
