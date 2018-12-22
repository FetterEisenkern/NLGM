var databaseList = [];
var filteredList = [];
var compareList = [];
var count = 0;

var filter = {
    shouldApply() {
        return this.result || this.id || this.date || this.name;
    }
};

var renderList = () => {
    if (filter.shouldApply()) {
        filteredList = [];
        for (let item of databaseList) {
            if (filter.result && item.data.result.toFixed(2).toString().startsWith(filter.result)
                || (filter.id && item.id.toString().startsWith(filter.id))
                || (filter.date && item.date.startsWith(filter.date))
                || (filter.name && item.patient.startsWith(filter.name))) {
                filteredList.push(item);
            }
        }
    } else {
        filteredList = databaseList;
    }

    databaseTable.innerHTML = '';

    for (let index = 0; index < filteredList.length; ++index) {
        let item = filteredList[index];

        let id = document.createElement('td');
        let date = document.createElement('td');
        let patient = document.createElement('td');
        let result = document.createElement('td');
        let button = document.createElement('td');
        let deleteButton = document.createElement('td');
        let compare = document.createElement('td');

        id.innerHTML = item.id;
        date.innerHTML = item.date;
        patient.innerHTML = item.patient
        result.innerHTML = ((item.data.result) ? item.data.result.toFixed(2) : '0.00') + ' m/s';
        button.innerHTML = `<a class='button is-primary'>View</a>`;
        button.setAttribute('onclick', `addToResultPlot(${index})`);
        deleteButton.innerHTML = `<a class='button is-danger'>Delete</a>`;
        deleteButton.setAttribute(`onclick`, `deleteItem(${index})`);
        compare.innerHTML = `<a class='button is-success'>Compare</a>`;
        compare.setAttribute(`onclick`, `compareItem(${index})`);

        let row = document.createElement('tr');
        row.appendChild(id);
        row.appendChild(date);
        row.appendChild(patient);
        row.appendChild(result);
        row.appendChild(button);
        row.appendChild(deleteButton);
        row.appendChild(compare);

        databaseTable.appendChild(row);
    }
};

var addToResultPlot = (index) => {
    selectTab(1);
    if (filteredList.length > 0 && index <= filteredList.length) {
        renderResult(filteredList[index].data);
    }
};

var deleteItem = (index) => {
    ipcRenderer.send('delete-db-row', filteredList[index].id);
    databaseList.splice(databaseList.indexOf(filteredList[index]), 1);
    renderList();
}

var compareItem = (index) => {
    
    compareList[count] = index;
    count++;
    if (count >= 2) {
        clickCorrelationButton(compareList[0], compareList[1]);
        count = 0;
    }
   
}

renderList();
