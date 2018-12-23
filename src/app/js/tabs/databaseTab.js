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
                || (filter.name && item.getName().startsWith(filter.name))) {
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
        let name = document.createElement('td');
        let result = document.createElement('td');
        let actions = document.createElement('td');

        id.innerHTML = item.id;
        date.innerHTML = item.date;
        name.innerHTML = item.getName();
        result.innerHTML = ((item.data.result) ? item.data.result.toFixed(2) : '0.00') + ' m/s';
        actions.innerHTML = `<div class="field is-grouped">
            <p class="control">
                <a class="button is-small is-primary is-outlined" onclick="addToResultPlot(${index})">
                    View
                </a>
            </p>
            <p class="control" onclick="deleteItem(${index})">
                <a class="button is-small is-danger is-outlined">
                    Delete
                </a>
            </p>`;

        let row = document.createElement('tr');
        row.appendChild(id);
        row.appendChild(date);
        row.appendChild(name);
        row.appendChild(result);
        row.appendChild(actions);

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

var sortList = (type) => {
    switch (type) {
        case 0:
            databaseList.sort((a, b) => a.id < b.id);
            break;
        case 1:
            databaseList.sort((a, b) => a.id > b.id);
            break;
        case 2:
            databaseList.sort((a, b) => a.data.result < b.data.result);
            break;
        case 3:
            databaseList.sort((a, b) => a.data.result > b.data.result);
            break;
    }
    renderList();
};

renderList();
