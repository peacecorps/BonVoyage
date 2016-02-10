var enableBtn = function() {
	document.getElementById("submitInfo").disabled = false;
	console.log('this is a test?');
}

$(function() {
	$('#submitInfo').click(function(e) {
		var data = $('#inputEmail').val();
		$.ajax({
			method: 'POST',
            contentType: "application/x-www-form-urlencoded",
			data: {
				email: data
			},
			url: '/api/reset',
			dataType: 'json',
			success: function(response, textStatus, jqXHR) {
				if (response && response.redirect) {
                    window.location.href = response.redirect;
				}
			}
		});
	});
});