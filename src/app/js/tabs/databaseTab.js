var databaseList = [];
var filteredList = [];
var filteredResults = [];
var refreshList = false;

var renderList = () => {
    databaseTable.innerHTML = '';

    for (let index = 0; index < filteredList.length; ++index) {
        let item = filteredList[index];

        let id = document.createElement('td');
        let date = document.createElement('td');
        let patient = document.createElement('td'); 
        let result = document.createElement('td');
        let button = document.createElement('td');

        id.innerHTML = item.id;
        date.innerHTML = item.date;
        patient.innerHTML = item.patient;
        result.innerHTML = ((item.data.result) ? item.data.result.toFixed(2) : '0.00') + ' m/s';
        button.innerHTML = `<a class='button is-primary'>View</a>`;
        button.setAttribute('onclick', `addToResultPlot(${index})`);

        let row = document.createElement('tr');
        row.appendChild(id);
        row.appendChild(date);
        row.appendChild(patient);
        row.appendChild(result);
        row.appendChild(button);

        databaseTable.appendChild(row);
    }
};

var addToResultPlot = (index) => {
    selectTab(1);
    if (databaseList.length > 0 && index <= databaseList.length) {
        renderResult(databaseList[index]);
    }
};

var searchForResult = (res) => {
    filteredList = [];
    for (let item of databaseList) {
        if (item.data.result.toFixed(2).toString().startsWith(res)) {
            filteredList.push(item)
        }
    }
};

var searchForPerson = (name) => {
    name = name.toLowerCase();
    filteredList = databaseList.filter(val => val.patient.toLowerCase().match(name));
};

filteredList = databaseList;
renderList();
databasePatientInput.focus();

