const bulmaSteps = require('bulma-steps');

var currentStep = 0;
var steps = undefined;

var renderSteps = () => {
    currentStep = 0;
    steps = new bulmaSteps(newSteps, { onShow: (id) => renderStep(id) });
};

var renderStep = (id) => {
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

            newResultLength1.innerHTML = newLength1Input.value;
            newResultLength2.innerHTML = newLength2Input.value;
            newResultName.innerHTML = newPatientNameInput.value;
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
};

var m1Data = [];
var m2Data = [];

var m1Lines = [];
var m2Lines = [];

var newPlotLayout = {
    xaxis: {
        title: 'Time [ms]',
    },
    yaxis: {
        title: 'Volt [mV]',
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
        voltage.push(point.volt);
        time.push(point.ms);
    }

    lines.push({
        y: voltage,
        x: time,
        line: {
            shape: 'spline'
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
    return newPatientNameInput.value.length != 0
        && newLength1Input.value.length != 0
        && newLength2Input.value.length != 0
        && m1Lines.length != 0
        && m2Lines.length != 0;
};

var getMeasurementData = () => {
    let measurement = {
        id: -1,
        date: undefined,
        patient: newPatientNameInput.value,
        data: {
            l1: parseInt(newLength1Input.value),
            l2: parseInt(newLength2Input.value),
            m1: m1Data,
            m2: m2Data,
            result: undefined
        }
    };
    measurement.data.result = calculateResult(measurement.data);
    return measurement;
};

var calculateResult = (data) => {
    let findMaximum = (points) => {
        let max = points[0];
        for (let point of points) {
            if (point.volt > max.volt) {
                max = point;
            }
        }
        return max;
    }

    /*
               | l1 - l2 |
        v = -----------------
            | tmax1 - tmax2 |
    */

    let tmax1 = findMaximum(data.m1).ms / 1000; // ms -> s
    let tmax2 = findMaximum(data.m2).ms / 1000; // ms -> s
    let l1 = data.l1 / 100; // cm -> m
    let l2 = data.l2 / 100; // cm -> m
    let deltaLength = Math.abs(l1 - l2);
    let deltaTime = Math.abs(tmax1 - tmax2);
    return deltaLength / deltaTime;
};

var renderMeasurement = (data) => {
    if (currentStep == 1) {
        m1Lines = [];
        addToNewPlot(m1Lines, m1Data = data.m1, 'm1');
        renderNewPlot1();
    } else if (currentStep == 2) {
        m2Lines = [];
        addToNewPlot(m2Lines, m2Data = data.m2, 'm2');
        renderNewPlot2();
    } else {
        console.error('Unable to render measurement!');
    }
};

var resetMeasurement = () => {
    m1Data = undefined;
    m2Data = undefined;
    m1Lines = [];
    m2Lines = [];
    renderSteps();
    renderNewPlot1();
    renderNewPlot2();
};

resetMeasurement();
