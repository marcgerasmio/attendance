const formatDateTime = (dateTimeString) => {
  if (dateTimeString) {
    const options = {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
    };
    return new Date(dateTimeString).toLocaleDateString(undefined, options);
  } else {
    return 'no data'; 
  }
};

const extractTime = (dateTimeString) => {
  if (dateTimeString) {
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
    };
    return new Date(dateTimeString).toLocaleTimeString(undefined, options);
  } else {
    return 'no data';
  }
};


function performSearch() {
  var selectedFunction = document.getElementById("function-selector").value;

  switch (selectedFunction) {
      case "fetchAndDisplayDate":
          fetchAndDisplayDate();
          break;
      case "fetchAndDisplayId":
        fetchAndDisplayId();
          break;
      case "fetchAndDisplayName":
            fetchAndDisplayName();
              break;
               
    
      default:
          console.error("Invalid function selected");
          break;
  }
}


function getCurrentDate() {
  const currentDate = new Date();
  
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1; // Months are zero-based
  console.log("Moa ni ang month:" + month);
  const year = currentDate.getFullYear();
  
  return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
}

function getCurrentMonthName() {
  // Create a new Date object
  var currentDate = new Date();
  
  // Array of month names
  var monthNames = [
      "JANUARY", "FEBRUARY", "MARCH", "APRIL",
      "MAY", "JUNE", "JULY", "AUGUST",
      "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
  ];
  
  // Get the month (0-based)
  var monthIndex = currentDate.getMonth();
  
  // Get the month name from the array
  var monthName = monthNames[monthIndex];
  
  return monthName;
}

// Example usage:
var currentMonthName = getCurrentMonthName();
console.log("Current month is: " + currentMonthName);





async function fetchAndDisplay() {
  const supabaseUrl = 'zpbgaevzeilxsxxdmyjx.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwYmdhZXZ6ZWlseHN4eGRteWp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDE1ODMwMjMsImV4cCI6MjAxNzE1OTAyM30.IhZyJf9JWDZMC1AD0qLs5yv9D1QuINMVr-DeQooM0sM'; // Replace with your Supabase API key

  var currentMonthName = getCurrentMonthName();
  const formattedDate = getCurrentDate();

  try {
    const response = await fetch(`https://${supabaseUrl}/rest/v1/attendance?select=*,names(*)&date=eq.${formattedDate},&month=eq.${currentMonthName}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
      },
    });

    console.log(response);

    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }

    const data  = await response.json();

    // Sort data based on time_in_AM in ascending order
    data.sort((a, b) => new Date(a.time_in_AM) - new Date(b.time_in_AM));

    const tableHead = document.getElementById('tableHead');
    tableHead.innerHTML = '';
    const head = document.createElement('tr');
    head.innerHTML = `
      <th>ID No.</th>
      <th>Intern Name</th>
      <th>Time In AM-buntag</th>
      <th>Time Out Noon</th>
      <th>Time In Afternoon</th>
      <th>Time Out Afternoon</th>
    `;
    tableHead.appendChild(head);

    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';

    data.forEach(row => {
      const newRow = document.createElement('tr');
      newRow.innerHTML = `
        <td style="background-color:white; width:200px; text-align:center">${row.student_id}</td>
        <td style="background-color:white; width:300px; text-align:center">${row.names.name}</td>
        <td style="background-color:white; width:400px; text-align:center">${extractTime(row.time_in_AM)}</td>
        <td style="background-color:white; width:400px; text-align:center">${extractTime(row.time_out_NOON)}</td>
        <td style="background-color:white; width:400px; text-align:center">${extractTime(row.time_in_PM)}</td>
        <td style="background-color:white; width:400px; text-align:center">${extractTime(row.time_out_PM)}</td>
      `;
      tableBody.appendChild(newRow);
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}



async function fetchAndDisplayDate() {
  const supabaseUrl = 'zpbgaevzeilxsxxdmyjx.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwYmdhZXZ6ZWlseHN4eGRteWp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDE1ODMwMjMsImV4cCI6MjAxNzE1OTAyM30.IhZyJf9JWDZMC1AD0qLs5yv9D1QuINMVr-DeQooM0sM'; // Replace with your actual API key

  try {
  
      const selectedDate = document.getElementById('date-input').value;

      const response = await fetch(`https://${supabaseUrl}/rest/v1/attendance?select=*,names(*)&date=eq.${selectedDate}`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              'apikey': supabaseKey,
          },
      });

      if (!response.ok) {
          throw new Error(`Error fetching data: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(data);

      data.sort((a, b) => new Date(a.time_in_AM) - new Date(b.time_in_AM));

      const tableHead = document.getElementById('tableHead');
      tableHead.innerHTML = '';
      const head = document.createElement('tr');
      head.innerHTML = `
          <th>ID No.</th>
          <th>Intern Name</th>
          <th>Time In AM</th>
          <th>Time Out Noon</th>
          <th>Time In Afternoon</th>
          <th>Time Out Afternoon</th>

      `;
      tableHead.appendChild(head);

      const tableBody = document.getElementById('tableBody');
      tableBody.innerHTML = '';

      data.forEach(row => {
          const formatDateTime = (dateTimeString) => {
              if (dateTimeString) {
                  const options = {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                      second: 'numeric',
                      hour12: true,
                  };
                  return new Date(dateTimeString).toLocaleDateString(undefined, options);
              } else {
                  return 'no data';
              }
          };

          const newRow = document.createElement('tr');
          newRow.innerHTML = `
          <td style="background-color:white; width:200px; text-align:center">${row.student_id}</td>
          <td style="background-color:white; width:300px; text-align:center">${row.names.name}</td>
          <td style="background-color:white; width:400px; text-align:center">${extractTime(row.time_in_AM)}</td>
          <td style="background-color:white; width:400px; text-align:center">${extractTime(row.time_out_NOON)}</td>
          <td style="background-color:white; width:400px; text-align:center">${extractTime(row.time_in_PM)}</td>
          <td style="background-color:white; width:400px; text-align:center">${extractTime(row.time_out_PM)}</td>
          `;
          tableBody.appendChild(newRow);
      });
  } catch (error) {
      console.error('Error:', error.message);
  }
}


async function fetchAndDisplayName() {
  const supabaseUrl = 'zpbgaevzeilxsxxdmyjx.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwYmdhZXZ6ZWlseHN4eGRteWp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDE1ODMwMjMsImV4cCI6MjAxNzE1OTAyM30.IhZyJf9JWDZMC1AD0qLs5yv9D1QuINMVr-DeQooM0sM'; // Replace with your actual API key

  try {
    const name = document.getElementById('search-bar').value;

    const response = await fetch(`https://${supabaseUrl}/rest/v1/attendance?select=*,names(*)&names.name=eq.${name}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(data);

    const tableHead = document.getElementById('tableHead');
    tableHead.innerHTML = '';
    const head = document.createElement('tr');
    head.innerHTML = `
      <th>ID No.</th>
      <th>Intern Name</th>
      <th>Time In</th>
      <th>Time Out</th>
    `;
    tableHead.appendChild(head);

    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';

    data.forEach(row => {
      const newRow = document.createElement('tr');
      newRow.innerHTML = `
        <td style="background-color:white; width:200px; text-align:center">${row.student_id}</td>
        <td style="background-color:white; width:300px; text-align:center">${row.names.name}</td>
        <td style="background-color:white; width:400px; text-align:center">${formatDateTime(row.time_in)}</td>
        <td style="background-color:white; width:400px; text-align:center">${formatDateTime(row.time_out)}</td>
      `;
      tableBody.appendChild(newRow);
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function fetchAndDisplayId() {
  const supabaseUrl = 'zpbgaevzeilxsxxdmyjx.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwYmdhZXZ6ZWlseHN4eGRteWp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDE1ODMwMjMsImV4cCI6MjAxNzE1OTAyM30.IhZyJf9JWDZMC1AD0qLs5yv9D1QuINMVr-DeQooM0sM'; // Replace with your actual API key

  try {
    const studentId = document.getElementById('search-bar').value;

    const response = await fetch(`https://${supabaseUrl}/rest/v1/attendance?select=*,names(*)&student_id=eq.${studentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(data);
    data.sort((a, b) => new Date(a.time_in_AM) - new Date(b.time_in_AM));

    const tableHead = document.getElementById('tableHead');
    tableHead.innerHTML = '';
    const head = document.createElement('tr');
    head.innerHTML = `
      <th>ID No.</th>
      <th>Intern Name</th>
      <th>Time In AM</th>
      <th>Time Out Noon</th>
      <th>Time In Afternoon</th>
      <th>Time Out Afternoon</th>
    `;
    tableHead.appendChild(head);

    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';

    data.forEach(row => {
      const newRow = document.createElement('tr');
      newRow.innerHTML = `
        <td style="background-color:white; width:200px; text-align:center">${row.student_id}</td>
        <td style="background-color:white; width:300px; text-align:center">${row.names.name}</td>
        <td style="background-color:white; width:400px; text-align:center">${formatDateTime(row.time_in_AM)}</td>
        <td style="background-color:white; width:400px; text-align:center">${formatDateTime(row.time_out_NOON)}</td>
        <td style="background-color:white; width:400px; text-align:center">${formatDateTime(row.time_in_PM)}</td>
        <td style="background-color:white; width:400px; text-align:center">${formatDateTime(row.time_out_PM)}</td>
        <h2 id="extractedHour"></h2>
      `;
      tableBody.appendChild(newRow);
    });

  } catch (error) {
    console.error('Error:', error.message);
  }
}

fetchAndDisplay();


