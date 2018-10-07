// Counter code

/*var counterBtn = document.getElementById('counter');

counterBtn.onclick = function () {
	// Create a request object
	var request = new XMLHttpRequest();

	// Capture the response and store it in a variable
	request.onreadystatechange = function () {
		if (request.readyState == XMLHttpRequest.DONE) {
			// Take some action
			if (request.status == 200) {
				var counter = request.responseText;
				var span = document.getElementById('count');
				span.innerHTML = counter.toString();
			}
		}
		// Not done yet
	};

	// Make a request
	request.open('GET', 'http://localhost:8080/counter', true);
	request.send(null);
	
};

*/


// Submit Name
/*
var submit = document.getElementById('submit_btn');
submit.onclick = function() {
	// Create a request object
	var request = new XMLHttpRequest();

	// Capture the response and store it in a variable
	request.onreadystatechange = function () {
		if (request.readyState == XMLHttpRequest.DONE) {
			// Take some action
			if (request.status == 200) {
				// Capture a list of names and render it as a list
				var names = request.responseText;
				names = JSON.parse(names);
				var list = '';
				for (var i = 0; i < names.length; i++) {
					list += '<li>' + names[i] + '</li>';
				}
				var ul = document.getElementById('nameList');
				ul.innerHTML = list;
			}
		}
		// Not done yet
	};

	var nameInput = document.getElementById('name');
	var name = nameInput.value;
	// Make a request
	request.open('GET', 'http://localhost:8080/submit-name?name=' + name, true);
	request.send(null);
	
};
*/

// Submit username/password to login

var login_btn = document.getElementById('login_btn');

login_btn.onclick = function() {
	// Create a request object
	var request = new XMLHttpRequest();

	// Capture the response and store it in a variable
	request.onreadystatechange = function () {
		if (request.readyState == XMLHttpRequest.DONE) {
			// Take some action
			if (request.status == 200) {
				console.log('user logged in!');
				alert('Welcome back ' + username);
			} else if (request.status === 403){
				alert('Check your username/password');
			} else if (request.status === 500) {
				alert('something went wrong on the server..');
			}
		}
	};

	var username = (document.getElementById('username')).value;
	var password = (document.getElementById('password')).value;

	console.log(username);
	console.log(password);
	// Make a request
	request.open('POST', 'http://localhost:8080/login', true);
	request.setRequestHeader('Content-Type', 'application/json');
	request.send(JSON.stringify({username:username, password:password}));	
};


var login_op = document.getElementById('login_op');
login_op.onclick = function() {
	document.getElementById('loginPanelBack').classList.remove('hidden');
	document.getElementById('main').classList.add('hidden');
};

var login_op_c = document.getElementById('login-panel-close');
login_op_c.onclick = function() {
	document.getElementById('loginPanelBack').classList.add('hidden');
	document.getElementById('main').classList.remove('hidden');
};

var cr_n_art = document.getElementById('create-art-btn');
cr_n_art.onclick = function() {
	document.getElementById('new-art-back').classList.remove('hidden');
	document.getElementById('old-art-back').classList.add('hidden');
};

var cl_n_art = document.getElementById('new-art-close');
cl_n_art.onclick = function() {
	document.getElementById('new-art-back').classList.add('hidden');
	document.getElementById('old-art-back').classList.remove('hidden');
};

var go_down_btn = document.getElementById('go-down-btn');
go_down_btn.onclick = function() {
	
};

// Script for side nav

var sidenav_btn = document.getElementById('sidenav-btn');
var sidenav = document.getElementById('sidenav');
sidenav_btn.onclick = function () {
	sidenav.classList.toggle('is-hidden');
}
