const formatDateTime = (dateTimeString) => {
  if (dateTimeString) {
    const options = {
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
const extractDate = (dateTimeString) => {
  if (dateTimeString) {
    const options = {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    };
    return new Date(dateTimeString).toLocaleDateString(undefined, options);
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
    <th>Intern Name</th>
    <th>Time In AM</th>
    <th>Time Out AM</th>
    <th>Time In PM</th>
    <th>Time Out PM</th>
    `;
    tableHead.appendChild(head);

    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';

    data.forEach(row => {
      const newRow = document.createElement('tr');
      newRow.classList.add('table-row'); 
      newRow.innerHTML = `
        <td>${row.names.name}</td>
        <td>${extractTime(row.time_in_AM)}</td>
        <td>${extractTime(row.time_out_NOON)}</td>
        <td>${extractTime(row.time_in_PM)}</td>
        <td>${extractTime(row.time_out_PM)}</td>
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
          <th>Intern Name</th>
          <th>Time In AM</th>
          <th>Time Out AM</th>
          <th>Time In PM</th>
          <th>Time Out PM</th>
          <th>Rendered Hours</th>
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
      function empty(element) {
        element.innerHTML = ""; 
     }
     
      const totalRenderedHoursTag = document.getElementById('totalRenderedHours');
     empty(totalRenderedHoursTag);
      const studentname = document.getElementById('studentname');
  empty(studentname);


      const newRow = document.createElement('tr');
      const renderedHoursAM = calculateRenderedHours(row.time_in_AM, row.time_out_NOON);
      const renderedHoursPM = calculateRenderedHoursPM(row.time_in_PM, row.time_out_PM);
      const totalRenderedHours = sumRenderedHours(renderedHoursAM, renderedHoursPM);
      newRow.classList.add('table-row'); 
      newRow.innerHTML = `
              <td>${row.names.name}</td>
              <td>${extractTime(row.time_in_AM)}</td>
              <td>${extractTime(row.time_out_NOON)}</td>
              <td>${extractTime(row.time_in_PM)}</td>
              <td>${extractTime(row.time_out_PM)}</td>
              <td>${totalRenderedHours}</td>
          `;
      tableBody.appendChild(newRow);
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}
function calculateRenderedHours(timestamp1, timestamp2) {
  if (!timestamp1 || !timestamp2) {
    return '0:00'; // If either timestamp is null, return 0 hours
  }

  const timeDifference = calculateTimeDifference(timestamp1, timestamp2, 8, 12);
  return timeDifference;
}

function calculateRenderedHoursPM(timestamp3, timestamp4) {
  if (!timestamp3 || !timestamp4) {
    return '0:00'; // If either timestamp is null, return 0 hours
  }

  const timeDifference = calculateTimeDifference(timestamp3, timestamp4, 13, 17);
  return timeDifference;
}

function calculateTimeDifference(timestamp1, timestamp2, startHour, endHour) {
  let time1 = parseTimestamp(timestamp1);
  let time2 = parseTimestamp(timestamp2);

  let startOfDay = new Date(2000, 0, 1, startHour, 0, 0);
  if (time1 < startOfDay) {
    time1 = startOfDay;
  }

  let endOfDay = new Date(2000, 0, 1, endHour, 0, 0);
  if (time2 >= endOfDay) {
    time2 = endOfDay;
  }

  let hours = time2.getHours() - time1.getHours();
  let minutes = time2.getMinutes() - time1.getMinutes();

  if (minutes < 0) {
    hours--;
    minutes += 60;
  }

  if (hours >= 4 || (hours === 4 && minutes > 0)) {
    hours = 4;
    minutes = 0;
  }

  return `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
}

function parseTimestamp(timestamp) {
  const [date, time] = timestamp.split('T');
  const [hours, minutes, seconds] = time.split(':').map(Number);
  return new Date(2000, 0, 1, hours, minutes, seconds);
}

function sumRenderedHours(renderedHoursAM, renderedHoursPM) {
  const [hoursAM, minutesAM] = renderedHoursAM.split(':').map(Number);
  const [hoursPM, minutesPM] = renderedHoursPM.split(':').map(Number);

  const totalHours = hoursAM + hoursPM;
  const totalMinutes = minutesAM + minutesPM;

  let carryOverHours = 0;
  if (totalMinutes >= 60) {
    carryOverHours = Math.floor(totalMinutes / 60);
  }

  const finalHours = totalHours + carryOverHours;
  const finalMinutes = totalMinutes % 60;

  return `${finalHours}:${finalMinutes < 10 ? '0' : ''}${finalMinutes}`;
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
    const name = data[0].names.name;
    data.sort((a, b) => new Date(a.time_in_AM) - new Date(b.time_in_AM));

    let totalHours = 0;
    let totalMinutes = 0;

    data.forEach(row => {
      const renderedHoursAM = calculateRenderedHours(row.time_in_AM, row.time_out_NOON);
      const renderedHoursPM = calculateRenderedHoursPM(row.time_in_PM, row.time_out_PM);
      const totalRenderedHours = sumRenderedHours(renderedHoursAM, renderedHoursPM);
      const [hours, minutes] = totalRenderedHours.split(':').map(Number);
      totalHours += hours;
      totalMinutes += minutes;
    });

    let carryOverHours = 0;
    if (totalMinutes >= 60) {
      carryOverHours = Math.floor(totalMinutes / 60);
    }

    const finalHours = totalHours + carryOverHours;
    const finalMinutes = totalMinutes % 60;

    const totalRenderedTime = `${finalHours}:${finalMinutes < 10 ? '0' : ''}${finalMinutes}`;

    
    // Update the h3 tag with the total rendered hours
    const totalRenderedHoursTag = document.getElementById('totalRenderedHours');
    totalRenderedHoursTag.textContent = `Total Rendered Hours: ${totalRenderedTime}`;

    const studentname = document.getElementById('studentname');
    studentname.textContent = `Name: ${name}`;

    const tableHead = document.getElementById('tableHead');
    tableHead.innerHTML = '';
    const head = document.createElement('tr');
    head.innerHTML = `
      <th>Date</th>
      <th>Time In AM</th>
      <th>Time Out AM</th>
      <th>Time In PM</th>
      <th>Time Out PM</th>
      <th>Rendered Hours</th>
    `;
    tableHead.appendChild(head);

    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';

    data.forEach(row => {
      const newRow = document.createElement('tr');
      const renderedHoursAM = calculateRenderedHours(row.time_in_AM, row.time_out_NOON);
      const renderedHoursPM = calculateRenderedHoursPM(row.time_in_PM, row.time_out_PM);
      const totalRenderedHours = sumRenderedHours(renderedHoursAM, renderedHoursPM);
      newRow.classList.add('table-row'); 
      newRow.innerHTML = `
      <td>${extractDate(row.date)}</td>
      <td>${extractTime(row.time_in_AM)}</td>
      <td>${extractTime(row.time_out_NOON)}</td>
      <td>${extractTime(row.time_in_PM)}</td>
      <td>${extractTime(row.time_out_PM)}</td>
      <td>${totalRenderedHours}</td>
      `;
      tableBody.appendChild(newRow);
    });

    const downloadButton = document.getElementById('downloadButton');
    downloadButton.style.display = 'block';
    downloadButton.addEventListener('click', downloadExcel);
    
  
    function downloadExcel() {
      const dataToExport = [['Date', 'Time In AM', 'Time Out AM', 'Time In PM', 'Time Out PM', 'Rendered Hours']];
      data.forEach(row => {
          const renderedHoursAM = calculateRenderedHours(row.time_in_AM, row.time_out_NOON);
          const renderedHoursPM = calculateRenderedHoursPM(row.time_in_PM, row.time_out_PM);
          const totalRenderedHours = sumRenderedHours(renderedHoursAM, renderedHoursPM);
          dataToExport.push([
              extractDate(row.date),
              extractTime(row.time_in_AM),
              extractTime(row.time_out_NOON),
              extractTime(row.time_in_PM),
              extractTime(row.time_out_PM),
              totalRenderedHours
          ]);
      });
  
      // Calculate total rendered hours for the entire data
      let totalRenderedHoursForAllData = 0;
      data.forEach(row => {
          const renderedHoursAM = calculateRenderedHours(row.time_in_AM, row.time_out_NOON);
          const renderedHoursPM = calculateRenderedHoursPM(row.time_in_PM, row.time_out_PM);
          const totalRenderedHours = sumRenderedHours(renderedHoursAM, renderedHoursPM);
          const [hours, minutes] = totalRenderedHours.split(':').map(Number);
          totalRenderedHoursForAllData += hours + minutes / 60;
      });
  
      const finalTotalRenderedHours = Math.floor(totalRenderedHoursForAllData) + ':' + Math.round((totalRenderedHoursForAllData % 1) * 60);
  
      // Add the total rendered hours as the last row of dataToExport
      dataToExport.push(['Total Rendered Hours', '', '', '', '', '', finalTotalRenderedHours]);
  
      const csvContent = "data:text/csv;charset=utf-8," + dataToExport.map(e => e.join(",")).join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "table_data.csv");
      document.body.appendChild(link);
      link.click();
  }
  

  } catch (error) {
    console.error('Error:', error.message);
  }
}




function displayPicture() {
  var picture = document.getElementById('picture');
  picture.style.display = 'block'; // Display the picture

  setTimeout(function() {
      picture.style.display = 'none'; // Hide the picture after 5 seconds
  }, 5000);
}

// Call the function every 10 seconds
setInterval(displayPicture, 10000);

fetchAndDisplay();


