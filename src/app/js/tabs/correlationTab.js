let clickCorrelationButton = (index1, index2) => {


    ///*
    //var x = document.createElement("TR");
    //var t = document.createTextNode("new cell");
    //x.appendChild(t);
    //document.getElementById("ctd").appendChild(x);*/


    //// get input values
    //var fname = databaseList[0];
    //var lname = "A"


    var table = document.getElementById('cssTable');

    // add new empty row to the table
    // 0 = in the top
    // table.rows.length = the end
    // table.rows.length/2+1 = the center
    var newRow = table.insertRow(table.rows.length / 2 + 1);

    // add cells to the row
    var cel1 = newRow.insertCell(0);
    var cel2 = newRow.insertCell(1);
 
    // add values to the cells
    cel1.innerHTML = databaseList[index1].patient;
    cel2.innerHTML = databaseList[index2].patient;
   
   
    var newRow = table.insertRow(table.rows.length / 2 + 1);
    var cel1 = newRow.insertCell(0);
    var cel2 = newRow.insertCell(1);
    cel1.innerHTML = databaseList[index1].data.result.toFixed(2) + " m/s";
    cel2.innerHTML = databaseList[index2].data.result.toFixed(2) + " m/s";

  
    var newRow = table.insertRow(table.rows.length / 2 + 1);
    var cel1 = newRow.insertCell(0);
    var cel2 = newRow.insertCell(1);
    cel1.innerHTML = databaseList[index1].date;
    cel2.innerHTML = databaseList[index2].date;

    var newRow = table.insertRow(table.rows.length / 2 + 1);
    var cel1 = newRow.insertCell(0);
    var cel2 = newRow.insertCell(1);
    cel1.innerHTML = databaseList[index1].id;
    cel2.innerHTML = databaseList[index2].id;

};

