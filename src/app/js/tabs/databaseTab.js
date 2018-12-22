var databaseList = [];
var filteredList = [];
var rowsPerPage = 10;

var filter = {
    shouldApply() {
        return this.result || this.id || this.date || this.name;
    }
};

var renderList = (currentPage = 1) => {
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

    let paginatorPages = 0;

    for (let index = 0; index < filteredList.length; ++index) {
        if (index % rowsPerPage == 0) {
            ++paginatorPages;
        }

        if (paginatorPages != currentPage) {
            continue;
        }

        let item = filteredList[index];

        let id = document.createElement('td');
        let date = document.createElement('td');
        let patient = document.createElement('td');
        let result = document.createElement('td');
        let button = document.createElement('td');
        let deleteButton = document.createElement('td');

        id.innerHTML = item.id;
        date.innerHTML = item.date;
        patient.innerHTML = item.patient;
        result.innerHTML = ((item.data.result) ? item.data.result.toFixed(2) : '0.00') + ' m/s';
        button.innerHTML = `<a class='button is-primary'>View</a>`;
        button.setAttribute('onclick', `addToResultPlot(${index})`);
        deleteButton.innerHTML = `<a class='button is-danger'>Delete</a>`;
        deleteButton.setAttribute(`onclick`, `deleteItem(${index})`);

        let row = document.createElement('tr');
        row.appendChild(id);
        row.appendChild(date);
        row.appendChild(patient);
        row.appendChild(result);
        row.appendChild(button);
        row.appendChild(deleteButton);

        databaseTable.appendChild(row);
    }

    databasePaginator.innerHTML = '';

    for (let i = 1; i <= paginatorPages; ++i) {
        let link = document.createElement('a');
        link.setAttribute('class', (i == currentPage) ? 'pagination-link is-current' : 'pagination-link');
        link.setAttribute('onclick', `renderList(${i});`);
        link.innerHTML = i;

        let item = document.createElement('li');
        item.appendChild(link);
        databasePaginator.appendChild(item);
    }
};

var addToResultPlot = (index) => {
    selectTab(1);
    if (filteredList.length > 0 && index <= filteredList.length) {
        renderResult(filteredList[index]);
    }
};

var deleteItem = (index) => {
    ipcRenderer.send('delete-db-row', filteredList[index].id);
    databaseList.splice(databaseList.indexOf(filteredList[index]), 1);
    renderList();
}

renderList();
