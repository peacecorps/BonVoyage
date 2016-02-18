/* globals window */
/* globals confirm */

$(function() {
	'use strict';

	function getIdForButton(button) {
		return $(button).closest('.list-group-item').find('.id').text();
	}
	function getNameForButton(button) {
		return $(button).closest('.list-group-item').find('.name').text();
	}
	function getAccessForButton(button) {
		return $(button).closest('.list-group-item').data('access');
	}

	// Handle Deletion requests
	$('.delete:not(.disabled)').click(function() {
		if(confirm('Are you sure that you want to delete ' +
			getNameForButton(this) + '\'s account?')) {
			$.ajax({
				method: 'DELETE',
	            contentType: "application/x-www-form-urlencoded",
				data: {
					userId: getIdForButton(this),
				},
				url: '/api/users',
				dataType: 'json',
				success: function(response) {
					if (response && response.redirect) {
	                    window.location.href = response.redirect;
					}
				}
			});
		}
	});

	// Handle Promotion & Demotion Requests
	$('.promote:not(.disabled), .demote:not(.disabled)').click(function() {
		$.ajax({
			method: 'POST',
            contentType: "application/x-www-form-urlencoded",
			data: {
				userId: getIdForButton(this),
				access: getAccessForButton(this) + ($(this).hasClass('promote') ? 1: -1)
			},
			url: '/api/access',
			dataType: 'json',
			success: function(response) {
				if (response && response.redirect) {
                    window.location.href = response.redirect;
				}
			}
		});
	});

	// Handle clicking on a user
	$('.name').on('click', function() {
		var href = $(this).attr('href');
		if(href) {
			window.location.href = href;
		}
	});
});
