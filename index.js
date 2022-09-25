import fetch from "node-fetch";
const sheetId = '1OziYYgstXPdyrZwWteejN6C3KZdXZppD';
const base = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?`;
const sheetName = 'user-data';
const query = encodeURIComponent('Select *')
const url = `${base}&sheet=${sheetName}&tq=${query}`

fetch(url)
  .then(res => res.text())
  .then(rep => {
    //Remove additional text and extract only JSON:
    const jsonData = JSON.parse(rep.substring(47).slice(0, -2));
    let rows = jsonData.table.rows;
    let headers = jsonData.table.cols
    let teams = [];
    let projects = [];
    let employees = [];
    headers.forEach(header => {
      //  console.log(header.label);
    });
    rows.forEach(row => {
      if (!employees.includes(row.c[3].v)) {
        employees.push(row.c[3].v);
      }
      if (!teams.includes(row.c[4].v)) {
        teams.push(row.c[4].v);
      }
      if (!projects.includes(row.c[1].v)) {
        projects.push(row.c[1].v);
      }
    });
    let count, sum, result;
    teams.forEach(team => {
      projects.forEach(project => {
        sum = 0;
        count = 0;
        rows.forEach(row => {
          if (project === row.c[1].v && team === row.c[4].v) {
            count++;
            sum += row.c[2].v;
          }
        })
        result = sum / count;
         console.log("Mean effort of team " + team + " on project " + project + " is " + (isNaN(result) ? 0 : result));
      });
    });
    let temparr = [], i = 0, temvar, j;
    employees.forEach(employee => {
      let sum = 0;
      rows.forEach(row => {
        if (employee === row.c[3].v) {
          sum += row.c[2].v;
        }
      })
      temparr[i] = sum;
      i++;
    })
    for (i = 0; i < employees.length - 1; i++) {
      for (j = i + 1; j < employees.length; j++) {
        if (temparr[i] > temparr[j]) {
          temvar = temparr[i];
          temparr[i] = temparr[j];
          temparr[j] = temvar;
          temvar = employees[i];
          employees[i] = employees[j];
          employees[j] = temvar;
        }
      }
    }
    console.log("5 employees with the lowest efficiency are given below:");
    for(i=0;i<5;i++){
      console.log(employees[i]);
    }
  })