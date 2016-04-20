function isValid(reference) {
	reference.css('border', '3px solid #1FDA9A');
}

function isNotValid(reference) {
	reference.css('border', '3px solid #DB3340');
}

function validate(reference, validate) {
	if (reference && reference.val() === '') {
		reference.css('border', '1px solid #ccc');
		return false;
	}

	if (reference && validate) {
		isValid(reference);
		return true;
	} else {
		isNotValid(reference);
		return false;
	}
}

function getPosition(str, m, i) {
	return str.split(m, i).join(m).length;
}

var enableBtn = function() {
	document.getElementById('signupInfo').disabled = false;
}

$(function () {
	// reference token
	var uri = window.location.href;
	uri = uri.substring(uri.indexOf('register'));
	var email = uri.substring(getPosition(uri, '/', 1) + 1, getPosition(uri, '/', 2));
	var token = uri.substring(getPosition(uri, '/', 2) + 1);
	$('#signupEmail').val(email);
	$('#signupToken').val(token);

	$('.form-signin').attr('action', '/api/register');
	$('.form-signin').attr('method', 'post');

	// initialize phone field
	var password = $('#signupPassword');
	var rePassword = $('#signupPassword2');

	password.on('keyup change', function () {
		var password1 = password.val();
		var password2 = rePassword.val();

		var valid = validate(password, password1 !== '' && password1 === password2);
		validate(rePassword, password1 !== '' && password1 === password2);

		if (valid) enableBtn();
	});

	rePassword.on('keyup change', function () {
		var password1 = password.val();
		var password2 = rePassword.val();

		var valid = validate(password, password1 !== '' && password1 === password2);
		validate(rePassword, password1 !== '' && password1 === password2);

		if (valid) enableBtn();
	});
});
