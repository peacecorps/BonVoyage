$(document).ready(function() {
	$('#logout').click(function() {
		$.ajax({
			method: "POST",
			url: "/logout"
		});
	});
});