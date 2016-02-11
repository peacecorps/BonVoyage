// var enableBtn = function() {
// 	document.getElementById("submitInfo").disabled = false;
// 	console.log('this is a test?');
// }

$(function() {
	var uri = window.location.href;
	var token = uri.substring(uri.indexOf('/reset') + 7);
	console.log(token);

	$('#submitInfo').click(function(e) {
		var data = $('#inputPassword').val();
		console.log(data);
		$.ajax({
			method: 'POST',
            contentType: "application/x-www-form-urlencoded",
			data: {
				password: data
			},
			url: '/api/reset/' + token,
			dataType: 'json',
			success: function(response, textStatus, jqXHR) {
				if (response && response.redirect) {
                    window.location.href = response.redirect;
				}
			}
		});
	});
});