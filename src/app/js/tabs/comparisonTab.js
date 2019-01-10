var name1, id1, result1, date1;
var name2, id2, result2, date2;
var row1, row2, row3, row4;

let compare = (index1, index2) => {


    ///*
    //var x = document.createElement("TR");
    //var t = document.createTextNode("new cell");
    //x.appendChild(t);
    //document.getElementById("ctd").appendChild(x);*/


    //// get input values
    //var fname = databaseList[0];
    //var lname = "A"



    // add values to the cells
    name1.innerHTML = index1.patient;
    id1.innerHTML =   index1.id;
    result1.innerHTML = index1.data.result.toFixed(2) + " m/s";
    date1.innerHTML = index1.date;




    name2.innerHTML = index2.patient;
    id2.innerHTML = index2.id;
    result2.innerHTML = index2.data.result.toFixed(2) + " m/s";
    date2.innerHTML = index2.date;




};

let init = () => {
    row1 = document.getElementById('row1');
    row2 = document.getElementById('row2');
    row3 = document.getElementById('row3');
    row4 = document.getElementById('row4');

    name1 = row1.insertCell(1);
    name2 = row1.insertCell(2);
    id1 = row2.insertCell(1);
    id2 = row2.insertCell(2);
    result1 = row3.insertCell(1);
    result2 = row3.insertCell(2);
    date1 = row4.insertCell(1);
    date2 = row4.insertCell(2);


};

