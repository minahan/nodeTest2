// Userlist data array for filling in info box
var userListData = [];

// DOM ready ==========================================================
$(document).ready(function() {

	// Populate the user table on initial page load
	populateTable();
	$('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);
	$('#btnAddUser').on('click', addUser);
	$('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);

});



// Functions ==========================================================

// Fill table with data
function populateTable() {

	// Empty content string
	var tableContent = '';

	// jQuery AJAX call for JSON
	$.getJSON('/userlist', function(data) {
		userListData = data;

		// For each item in our JSON, add a table row and cells to the content string
		$.each(data, function() {
			tableContent += '<tr>';
			tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '" title="Show Details">' + this.username + '</td>';
			tableContent += '<td>' + this.email + '</td>';
			tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
		});

		// Inject the whole content string into our existing HTML table
		$('#userList table tbody').html(tableContent);
	});
};

// Show User info
function showUserInfo(event) {
 // Prevent Link from Firing
  event.preventDefault();

  // Retrieve username from link rel attribute
  var thisUserName = $(this).attr('rel');

  // Get Index of object based on id value
  var arrayPosition = userListData.map(function(arrayItem) { return arrayItem.username; }).indexOf(thisUserName);

  // Get our User Object
  var thisUserObject = userListData[arrayPosition];

  //Populate Info Box
  $('#userInfoName').text(thisUserObject.fullname);
  $('#userInfoAge').text(thisUserObject.age);
  $('#userInfoGender').text(thisUserObject.gender);
  $('#userInfoLocation').text(thisUserObject.location);

};


// Add User
function addUser(event) {
	event.preventDefault();

	// Super basic validation - increase errorCount variable if any fields are blank
	var errorCount = 0;
	$('#addUser input').each(function(index, val) {
		if($(this).val === '') { errorCount++ }
	});

	// Check and make sure errorCount's still at zero
	if (errorCount === 0) {
		// If it is, compile all user info into one object
		var newUser = {
			'username': $('#addUser fieldset input#inputUserName').val(),
			'email': $('#addUser fieldset input#inputUserEmail').val(),
			'fullname': $('#addUser fieldset input#inputUserFullname').val(),
			'age': $('#addUser fieldset input#inputUserAge').val(),
			'location': $('#addUser fieldset input#inputUserLocation').val(),
			'gender': $('#addUser fieldset input#inputUserGender').val(),
		};

		// Use AJAX to post the object to our adduser service
		$.ajax({
			type: 'POST',
			data: newUser,
			url: '/adduser',
			dataType: 'JSON'
		}).done(function(response) {
			if (response.msg === '') {
				// Clear the form
				$("#addUser fieldset input").val('');

				// Update table
				populateTable();

			} else {
				// If something goes wrong, alert the error message that our service returned
				alert('Error: ' + response.msg)
			}
		});

	} else {
		// If errorCount is more than 0, then error out
		alert('Please fill in all the fields');
		return false;
	}
}

function deleteUser(event) {
	event.preventDefault();

	// confirmation
	var confirmation = confirm('Are you sure you want to delete this user?');

	// Check and make sure user confirmed
	if (confirmation === true) {
		var id = $(this).attr('rel');
		$.ajax({
			type: 'DELETE',
			url: '/deleteuser/' + id
		}).done(function(response) {
			if (response.msg === '') {
					//alert('Deleted user ' + id);
				} else {
					// If something goes wrong, alert the error message that our service returned
					alert('Error: ' + response.msg);
				}
			// update table
			populateTable();
		})
	} else {

		// They didn't confirm, so nothing
		return false;
	}
}
