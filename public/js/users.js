

function getNameForButton(button) {
	return $(button).closest('.list-group-item').find('.name').text();
}
function getEmailForButton(button) {
	return $(button).closest('.list-group-item').find('.email').text();
}
function getAccessForButton(button) {
	return $(button).closest('.list-group-item').data('access');
}

$(function() {
	// Handle Deletetion requests
	$('.delete:not(.disabled)').click(function(e) {
		if(confirm('Are you sure that you want to delete ' + getNameForButton(this) + '\'s account?')) {
			$.ajax({
				method: 'DELETE',
	            contentType: "application/x-www-form-urlencoded",
				data: {
					email: getEmailForButton(this)
				},
				url: '/api/users',
				dataType: 'json',
				success: function(response, textStatus, jqXHR) {
					if (response && response.redirect) {
	                    window.location.href = response.redirect;
					}
				}
			});
		}
	});

	// Handle Promotion & Demotion Requests
	$('.promote:not(.disabled), .demote:not(.disabled)').click(function(e) {
		$.ajax({
			method: 'POST',
            contentType: "application/x-www-form-urlencoded",
			data: {
				email: getEmailForButton(this),
				access: getAccessForButton(this) + ($(this).hasClass('promote') ? 1: -1)
			},
			url: '/api/access',
			dataType: 'json',
			success: function(response, textStatus, jqXHR) {
				if (response && response.redirect) {
                    window.location.href = response.redirect;
				}
			}
		});
	});
});