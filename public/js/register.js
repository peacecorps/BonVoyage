var global_validation = [false, false, false];

function isEmail(email) {
	var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	return regex.test(email);
}

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

function validateAll() {
	for (var i = 0; i < global_validation.length; i++) {
		if (!global_validation[i]) return;
	}

	enableBtn();
}

var enableBtn = function() {
	document.getElementById('signupInfo').disabled = false;
}

$(function () {
	// reference token
	var uri = window.location.href;
	var token = uri.substring(uri.indexOf('register') + 9);
	$('#signupToken').val(token);

	// initialize phone field
	var email = $('#signupEmail');
	var phoneNumber = $('#phone');
	var password = $('#signupPassword');
	var rePassword = $('#signupPassword2');

	phoneNumber.intlTelInput({
		utilsScript: '/js/utils.js',
	});

	email.on('keyup change', function () {
		global_validation[0] = validate(email, isEmail(email.val()));
		validateAll();
	});

	phoneNumber.on('keyup change', function () {
		global_validation[1] = validate(phoneNumber, phoneNumber.intlTelInput('isValidNumber'));
		validateAll();
	});

	password.on('keyup change', function () {
		var password1 = password.val();
		var password2 = rePassword.val();

		global_validation[2] = validate(password, password1 !== '' && password1 === password2);
		validate(rePassword, password1 !== '' && password1 === password2);

		validateAll();
	});

	rePassword.on('keyup change', function () {
		var password1 = password.val();
		var password2 = rePassword.val();

		global_validation[2] = validate(password, password1 !== '' && password1 === password2);
		validate(rePassword, password1 !== '' && password1 === password2);

		validateAll();
	});

	$('#signupInfo').on('click', function(event) {
		var tokenForm = $('#signupToken').val();
		var emailForm = $('#signupEmail').val();
		var phoneForm = phoneNumber.intlTelInput('getNumber');
		var passForm = $('#signupPassword').val();
		var passForm2 = $('#signupPassword2').val();

		var formData = {
			token: tokenForm,
			email: emailForm,
			phone: phoneForm,
			password: passForm,
			password2: passForm2,
		};

		$.ajax({
            method: 'POST',
            url: '/api/register',
            contentType: "application/x-www-form-urlencoded",
            data: formData,
            dataType: 'json',
            success: function(response) {
                if (response && response.redirect) {
                    window.location.href = response.redirect;
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
            	window.location.href = '/login';
			}
        });
	});
});
