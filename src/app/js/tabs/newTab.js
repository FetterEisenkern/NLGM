const bulmaSteps = require('bulma-steps');

var currentStep = 0;
var steps = undefined;

var renderSteps = () => {
    currentStep = 0;
    steps = new bulmaSteps(newSteps, {
        onShow: (id) => {
            switch (currentStep = id) {
                case 1:
                    renderNewPlot1();
                    break;
                case 2:
                    renderNewPlot2();
                    break;
                case 3:
                    if (validateData()) {
                        newViewResultButton.setAttribute('class', 'button is-success');
                        newViewResultButton.removeAttribute('disabled');
                        newViewResultButton.removeAttribute('title');
                    } else {
                        newViewResultButton.setAttribute('class', 'button is-danger');
                        newViewResultButton.setAttribute('disabled', '');
                        newViewResultButton.setAttribute('title', 'Data not complete!');
                    }
                    newResultName.innerHTML = newPatientNameInput.value;
                    newResultMeasurements.innerHTML = (m1Data) ? (m2Data) ? 2 : 1 : 0;
                    break;
                default:
                    break;
            }
        }
    });
};

var m1Data = undefined;
var m2Data = undefined;

var m1Lines = [];
var m2Lines = [];

var newPlotLayout = {
    xaxis: {
        title: 'Time [ms]',
    },
    yaxis: {
        title: 'Volt [V]',
    },
    margin: {
        t: 0
    }
};

var addToNewPlot = (lines, data, length, legend) => {
    lines.push({
        y: data,
        x: Array.from({ length: length }, (_, i) => i),
        line: {
            shape: 'spline'
        },
        name: legend
    });
};

var renderNewPlot1 = () => {
    Plotly.newPlot(newPlot1, m1Lines, newPlotLayout, { responsive: true, displayModeBar: false });
};
var renderNewPlot2 = () => {
    Plotly.newPlot(newPlot2, m2Lines, newPlotLayout, { responsive: true, displayModeBar: false });
};

var validateData = () => {
    return newPatientNameInput.value.length != 0
        && newLength1Input.value.length != 0
        && newLength2Input.value.length != 0
        && m1Lines.length != 0
        && m2Lines.length != 0;
};

var getMeasurementData = () => {
    return {
        patient: newPatientNameInput.value,
        data: {
            m1: m1Data,
            m2: m2Data
        }
    };
};

var renderMeasurement = (data) => {
    if (currentStep == 1) {
        m1Lines = [];
        addToNewPlot(m1Lines, m1Data = data.m1, 100, 'm1');
        renderNewPlot1();
    } else if (currentStep == 2) {
        m2Lines = [];
        addToNewPlot(m2Lines, m2Data = data.m2, 100, 'm2');
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
