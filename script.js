let xmlDoc;

async function loadXML() {

    try {

        const response = await fetch("attendance.xml");

        const xmlText = await response.text();

        const parser = new DOMParser();

        xmlDoc = parser.parseFromString(
            xmlText,
            "text/xml"
        );

        displayRecords();

    } catch(error) {

        console.log(error);

    }
}

function displayRecords() {

    const table =
    document.getElementById("attendanceTable");

    if(!table) return;

    table.innerHTML = "";

    const students =
    xmlDoc.getElementsByTagName("student");

    let present = 0;
    let absent = 0;

    for(let i=0; i<students.length; i++) {

        const id =
        students[i]
        .getElementsByTagName("id")[0]
        .textContent;

        const name =
        students[i]
        .getElementsByTagName("name")[0]
        .textContent;

        const date =
        students[i]
        .getElementsByTagName("date")[0]
        .textContent;

        const status =
        students[i]
        .getElementsByTagName("status")[0]
        .textContent;

        if(status==="Present"){
            present++;
        }else{
            absent++;
        }

        table.innerHTML += `
        <tr>
            <td>${id}</td>
            <td>${name}</td>
            <td>${date}</td>
            <td>${status}</td>
            <td>
                <button onclick="editRecord(${i})">
                Edit
                </button>
                <button onclick="deleteRecord(${i})">
                Delete
                </button>
            </td>
        </tr>
        `;
    }

    document.getElementById("totalStudents").innerHTML =
    students.length;

    document.getElementById("presentCount").innerHTML =
    present;

    document.getElementById("absentCount").innerHTML =
    absent;
}

function addAttendance() {

    const name =
    document.getElementById("studentName").value;

    const date =
    document.getElementById("attendanceDate").value;

    const status =
    document.getElementById("status").value;

    if(name==="" || date==="") {

        alert("Complete all fields");

        return;
    }

    const root =
    xmlDoc.getElementsByTagName("attendance")[0];

    const student =
    xmlDoc.createElement("student");

    const id =
    xmlDoc.createElement("id");

    const nameNode =
    xmlDoc.createElement("name");

    const dateNode =
    xmlDoc.createElement("date");

    const statusNode =
    xmlDoc.createElement("status");

    id.textContent =
    Date.now();

    nameNode.textContent =
    name;

    dateNode.textContent =
    date;

    statusNode.textContent =
    status;

    student.appendChild(id);
    student.appendChild(nameNode);
    student.appendChild(dateNode);
    student.appendChild(statusNode);

    root.appendChild(student);

    displayRecords();

    alert(
      "Record added. XML updated in memory."
    );
}

function editRecord(index) {

    const students =
    xmlDoc.getElementsByTagName("student");

    const currentName =
    students[index]
    .getElementsByTagName("name")[0]
    .textContent;

    const newName =
    prompt(
        "Edit Student Name",
        currentName
    );

    if(newName){

        students[index]
        .getElementsByTagName("name")[0]
        .textContent = newName;

        displayRecords();
    }
}

function deleteRecord(index) {

    const students =
    xmlDoc.getElementsByTagName("student");

    students[index].remove();

    displayRecords();
}

function searchStudent() {

    let input =
    document.getElementById("searchInput")
    .value
    .toLowerCase();

    let rows =
    document.querySelectorAll(
        "#attendanceTable tr"
    );

    rows.forEach(row=>{

        let name =
        row.cells[1]
        .innerText
        .toLowerCase();

        if(name.includes(input)){

            row.style.display="";

        }else{

            row.style.display="none";

        }
    });
}

window.onload = loadXML;