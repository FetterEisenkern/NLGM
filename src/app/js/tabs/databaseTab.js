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
        let deletebutton = document.createElement('td');


        id.innerHTML = item.id;
        date.innerHTML = item.date;
        patient.innerHTML = item.patient;
        result.innerHTML = ((item.data.result) ? item.data.result.toFixed(2) : '0.00') + ' m/s';
        button.innerHTML = `<a class='button is-primary'>View</a>`;
        button.setAttribute('onclick', `addToResultPlot(${index})`);
        deletebutton.innerHTML = `<a class='button is-danger'>Delete</a>`;
        deletebutton.setAttribute(`onclick`, `deleteItem(${index})`);

        let row = document.createElement('tr');
        row.appendChild(id);
        row.appendChild(date);
        row.appendChild(patient);
        row.appendChild(result);
        row.appendChild(button);
        row.appendChild(deletebutton);

        databaseTable.appendChild(row);
    }
};

var addToResultPlot = (index) => {
    selectTab(1);
    if (databaseList.length > 0 && index <= databaseList.length) {
        renderResult(databaseList[index]);
    }
};

var deleteItem = (index) => {
    ipcRenderer.send('delete-db-row', filteredList[index].id);
    databaseList.splice(index, 1);
    filteredList = databaseList;
    renderList();
    console.log(2)
    
    
}

var searchForResult = (res) => {
    filteredList = [];
    for (let item of databaseList) {
        if (item.data.result.toFixed(2).toString().startsWith(res)) {
            filteredList.push(item)
        }
    }
};

var searchForId = (id) => {
    filteredList = [];
    for (let item of databaseList) {
        if (item.id.toString().startsWith(id)) {
            filteredList.push(item)
        }
    }
};

var searchForDate = (date) => {
   
    filteredList = databaseList.filter(val => val.date.match(date));
};


var searchForPerson = (name) => {
    name = name.toLowerCase();
    filteredList = databaseList.filter(val => val.patient.toLowerCase().match(name));
};

filteredList = databaseList;
renderList();
databasePatientInput.focus();

