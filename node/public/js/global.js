$(document).ready(function() {
	$('#logout').click(function() {
		$.ajax({
			method: "POST",
			url: "/logout",
			success: function() {
				window.location.href = '/login';
			}
		});
	});
});