$(function() {
	var uri = window.location.href;
	var token = uri.substring(uri.indexOf('register') + 9);
	$('#signupToken').val(token);
});
