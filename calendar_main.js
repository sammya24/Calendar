isLoggedIn(); 
if (isLoggedIn()){ 
    alert("You are logged in as" + sessionStorage.getItem("username"));
}

function isLoggedIn() { //check to see if user is logged in
    if (sessionStorage.getItem("username") == 'undefined' ||sessionStorage.getItem("username") == null ||  sessionStorage.getItem("loggedIn") === "false" || sessionStorage.getItem("username") == "null"){
        return false;
    }
else{
    sessionStorage.getItem("loggedIn") === "true"
    $("#registration-form").hide();
    $("#login-form").hide();
    return true
}
}

document.addEventListener("DOMContentLoaded", function () {
    //register button click
    document.getElementById("register-button").addEventListener("click", function () {
        var formData = {
            username: $("#reg-username").val(),
            password: $("#reg-password").val(),
            token:  sessionStorage.getItem("token")
        };
    
        $.ajax({
            type: "POST",
            url: "calendar_createNewUser.php",
            data: formData,
            success: function (response) {
                var dat = response;
                if (response === "success") { //if registration successful
                    
                    //hide registration form
                    $("#registration-form").hide();
                    $("#registration-form")[0].reset();
                } else {
                    alert(response);
                    //registration unsuccessful
                    alert('Registration failed. Please try again.');
                }
            },
            error: function () {
                alert('Error during registration. Please try again later.');
            }
        });
    });
    

    //login button click
    document.getElementById("login-button").addEventListener("click", function () {
        
        var username = $("#login-username").val();
        var password = $("#login-password").val();

        if (username.trim() === "" || password.trim() === "") { //if either field blank
            alert("Please fill in both username and password fields.");
            sessionStorage.getItem("loggedIn") = false;
            return;
        }
        
        var loginData = {
            username: username,
            password: password,
        };
        console.log(loginData);
    
        //ajax request
        $.ajax({
            type: "POST",
            url: "calendar_login.php",
            data: loginData,
            dataType: "json",
            success: function (response) {
                sessionStorage.setItem("loggedIn", "true");
                sessionStorage.setItem("username", response.username);
                sessionStorage.setItem("token", response.token);
         
                alert("Successfully logged in. Welcome " + sessionStorage.getItem("username"));
                
                $("#login-form").hide();
                $("#registration-form").hide();
              },
            error: function (xhr, status, error) {
                console.log("XHR Status:", status);
                console.log("XHR Error:", error);
                console.log("Response Text:", xhr.responseText);
                alert('Error during login. Please try again later.');
            }
        });
    });
});

let currentYear, currentMonth;

//generate calendar grid
function generateCalendar(year, month) {
    //calc number of days in month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    //header rows for days of the week
    let calendarHTML = '<table>';
    calendarHTML += '<tr>';
    calendarHTML += '<th>Sun</th>';
    calendarHTML += '<th>Mon</th>';
    calendarHTML += '<th>Tue</th>';
    calendarHTML += '<th>Wed</th>';
    calendarHTML += '<th>Thu</th>';
    calendarHTML += '<th>Fri</th>';
    calendarHTML += '<th>Sat</th>';
    calendarHTML += '</tr>';

    //adjust start day
    const firstDay = new Date(year, month, 1).getDay();

    calendarHTML += '<tr>';
    for (let i = 0; i < firstDay; i++) {
        calendarHTML += '<td></td>';
    }

    let date = new Date(year, month, 1);
    while (date.getMonth() === month) {
        if (date.getDay() === 0) {
            calendarHTML += '</tr>';
            calendarHTML += '<tr>';
        }
        calendarHTML += `<td>${date.getDate()}</td>`;
        date.setDate(date.getDate() + 1);
    }

    //empty cells for lat row
    while (date.getDay() > 0 && date.getDay() < 7) {
        calendarHTML += '<td></td>';
        date.setDate(date.getDate() + 1);
    }

    calendarHTML += '</tr>';
    calendarHTML += '</table>';
    $('#calendar-grid').html(calendarHTML);
}

$('#update-event-button').on('click', function () {
    const eventId = $('#edit-event-id').val();
    const updatedTitle = $('#edit-event-title').val();
    const updatedTime = $('#edit-event-time').val();

    let selectedDate = $('#event-form').data('selectedDate');
    selectedDate = formatUserDate(selectedDate);

    const updatedEventData = {
        id: eventId,
        title: updatedTitle,
        time: updatedTime,
        date: selectedDate,
        token: sessionStorage.getItem("token")
    };

    console.log(updatedEventData);

    $.ajax({
        type: "POST",
        url: "update_event.php",
        data: updatedEventData,
        dataType: "json",
        success: function (response) {
            //handle the response, update the event display, hide the edit event form
            alert('Event updated successfully.');
            $('#edit-event-form').hide();
            $('#event-display-container').hide();
        },
        error: function (xhr, status, error) {
            console.log("Error:", status, error);
            alert('Error updating the event. Please try again later.');
        }
    });
});

function updateCalendar() {
    generateCalendar(currentYear, currentMonth);
}

$(document).ready(function () {
    //display calendar for month
    const currentDate = new Date();
    currentYear = currentDate.getFullYear();
    currentMonth = currentDate.getMonth();
    updateCalendar();

    updateMonthAndYear();

    //for changing month and year based on user clicks
    $('#prev-month').on('click', function () {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        updateCalendar();
        updateMonthAndYear();
    });

    $('#next-month').on('click', function () {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        updateCalendar();
        updateMonthAndYear();
    });
});


//get name of month
function getMonthName(monthIndex) {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return months[monthIndex];
}

function updateMonthAndYear() {
    $('#current-month-year').text(getMonthName(currentMonth) + ' ' + currentYear);
}

$('#calendar-grid').on('click', 'td', function () {
    
    const day = $(this).text(); //selected day's date
    
    //display event form to fill out
    $('#event-form').show();
    $('#event-title').val('');
    
    //put selected date in input field (hidden)
    $('#event-form').data('selectedDate', new Date(currentYear, currentMonth, day));
    
    let selectedDate = new Date(currentYear, currentMonth, day);
    selectedDate = formatUserDate(selectedDate);

    const eventData = {
        date: selectedDate,
        token: sessionStorage.getItem("token")
    };
    console.log(eventData);

    $.ajax({
        type: "POST", 
        url: "get_events.php",
        dataType: "json",
        data: eventData,
    
        success: function (response) {
            //successful
            displayEvents(response);
        },
        error: function (xhr, status, error) {
            console.log("Error:", status, error);
        }
    });
});

function formatUserTime(userTime) {
    //split user input into hours and mins
    const parts = userTime.split(":");
    
    //make sure 2 parts (hours and mins)
    if (parts.length === 2) {
        const hours = parts[0];
        const minutes = parts[1];
        
        //construct string with seconds set to 00
        return `${hours}:${minutes}:00`;
    } else {
        //if input invalid
        return null;
    }
}

function formatUserDate(userDate) {
    const dateObject = new Date(userDate);
    
    //see if input valid date
    if (isNaN(dateObject)) {
        //in valid input
        return null;
    }
    
    //format as 'YYYY-MM-DD'
    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, '0'); // Month is zero-based
    const day = String(dateObject.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
}

function createEvent(title, date, time) {
    if (isLoggedIn()) {
      
    time = formatUserTime(time);
    fdate = formatUserDate(date);

    const eventData = {
        title: title,
        date: fdate,
        username: sessionStorage.getItem("username"),
        time: time,
        token: sessionStorage.getItem("token")
    };

    console.log(eventData);

    $.ajax({
        type: "POST",
        url: "create_event.php",
        data: eventData,
        dataType: "json",
        success: function (response) {
            //event created successfuly
        },
      });
    
    //clear event form and hide
    $('#event-title').val('');
    $('#event-display-container').hide();
    //$('#event-description').val('');
    $('#event-form').hide();
    } else {
        alert("Please log in to create an event.");
    }

}

$('#create-event-button').on('click', function () {
    if (isLoggedIn()) {
        const title = $('#event-title').val();

        const selectedDate = $('#event-form').data('selectedDate');
        const time = $('#event-time').val();
        
        if (title && selectedDate && time) {
            createEvent(title, selectedDate, time);
        } else {
            alert('Please fill out all event details.');
        }
    } else {
        alert("Please log in to create an event.");
    }
   
});

function displayEvents(events) {
    alert
    if (!isLoggedIn()) {
        return;
    }

    //clear event display
    $('#event-display').empty();

    if (events.length === 0) {
        $('#event-display').append("<p>No events for this day.</p>");
    } else {
        //iterate events and display
        events.forEach(function (event) {
            const editButton = `<button class="edit-event" data-event-id="${event.id}">Edit</button>`;
            const deleteButton = `<button class="delete-event" data-event-id="${event.id}">Delete</button>`;
            $('#event-display').append(
                `<div class="event">
                    <p><strong>Title:</strong> ${event.title}</p>
                    <p><strong>Time:</strong> ${event.event_time}</p>
                    ${editButton} ${deleteButton}
                </div>
                <br>`
            );
        });
    }

    //show container
    $('#event-display-container').show();

    //click listener edit buttons
    $('.edit-event').click(function () {
        //get id
        $('#edit-event-form').show();
        const eventId = $(this).data('event-id');
        editEvent(eventId);
    });

    //click listener delete buttons
    $('.delete-event').click(function () {
        //get id
        const eventId = $(this).data('event-id');
        deleteEvent(eventId);
        $('#event-display-container').hide();
       
    });
}

function editEvent(eventId) {
   //event details
    const eventData = {
        id: eventId,
        token: sessionStorage.getItem("token")
    };

    $.ajax({
        type: "POST",
        url: "get_event_details.php", 
        dataType: "json",
        data: eventData,
        success: function (eventDetails) {
    
            $('#edit-event-id').val(eventDetails.id);
            $('#edit-event-title').val(eventDetails.title);
            $('#edit-event-time').val(eventDetails.event_time);
        
            //show edit event form
            $('#edit-event-form').show();
        },
        error: function (xhr, status, error) {
            console.log("Error:", status, error);
            alert('Error getting event details. Please try again later.');
        }
    });
}

function deleteEvent(eventId) {

    const eventData = {
        id: eventId,
        token: sessionStorage.getItem("token")
    };

    console.log(eventData);

    $.ajax({
        type: "POST",
        url: "delete_event.php", 
        data: eventData,
        success: function (response) {
            //delete success
        
            //refresh events
            a$('#calendar-grid td.selected').trigger('click');
            
        },
        error: function (xhr, status, error) {
            //errors
            console.log("Error:", status, error);
            alert('Error deleting the event. Please try again later.');
        }
    });
   
}

function convertMySQLTimeToHTMLTime(mysqlTime) {
    //split SQL to time, mins, secs
    const [hours, minutes, seconds] = mysqlTime.split(':').map(Number);
  
    //set
    const htmlTime = new Date();
    htmlTime.setHours(hours);
    htmlTime.setMinutes(minutes);
    htmlTime.setSeconds(seconds);
  
    //format into HH:MM
    const htmlTimeFormatted = htmlTime.toTimeString().slice(0, 5);
  
    return htmlTimeFormatted;
  }



  

