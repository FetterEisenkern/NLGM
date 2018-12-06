var databaseList = [];
var refreshList = false;

var renderList = () => {
    databaseTable.innerHTML = '';

    for (let index = 0; index < databaseList.length; ++index) {
        let item = databaseList[index];

        let id = document.createElement('td');
        let date = document.createElement('td');
        let patient = document.createElement('td');
        let result = document.createElement('td');
        let button = document.createElement('td');

        id.innerHTML = item.id;
        date.innerHTML = item.date;
        patient.innerHTML = item.patient;
        result.innerHTML = '0 m/s';
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
    clearResultPlot();
    if (databaseList.length > 0 && index <= databaseList.length) {
        let data = databaseList[index].data;
        addDataToResultPlot(data);
    }
    renderResultPlot();
};

renderList();
