
// Dynamically disable the comment button if the textarea is empty
function commentStoppedTyping() {
	if($('#new-comment').val().length > 0) {
		$('#submit-comment').removeClass('disabled');
	} else {
		$('#submit-comment').addClass('disabled');
	}
}

$(function() {
	// Format the dates for the trip itinerary
	$('.date').each(function(_, date) {
		var date_unf = $(date).data('unformatted');
		$(date).text(format_dateonly(date_unf));
	});
	// Format the timestamps for the comments
	$('.timestamp').each(function(_, time) {
		var time_unf = $(time).data('unformatted');
		$(time).text(format_time(time_unf, UTC_FORMAT_TIME));
	});

	$('#submit-comment').click(function() {
		var url = '/api/requests' + document.location.href.substring(document.location.href.lastIndexOf('/')) + '/comments'
		var data = $('#new-comment').val()
        $.ajax({
            method: "POST",
            contentType: "application/x-www-form-urlencoded",
            url: url,
            data: {content: data},
            success: function(response, textStatus, jqXHR) {
                if (response) {
                	window.location.href = JSON.parse(response).redirect;
                }
            }
        });
	});

    $('#request-approve-btn').click(function() {
    	var url = '/api/requests' + document.location.href.substring(document.location.href.lastIndexOf('/')) + '/approve'
        $.ajax({
            method: "POST",
            contentType: "application/x-www-form-urlencoded",
            url: url,
            success: function(response, textStatus, jqXHR) {
                if (response) {
                	window.location.href = JSON.parse(response).redirect;
                }
            }
        });
    });

    $('#request-deny-btn').click(function() {
    	var url = '/api/requests' + document.location.href.substring(document.location.href.lastIndexOf('/')) + '/deny'
        $.ajax({
            method: "POST",
            contentType: "application/x-www-form-urlencoded",
            url: url,
            success: function(response, textStatus, jqXHR) {
                if (response) {
                    window.location.href = JSON.parse(response).redirect;
                }
            }
        });
    });

    $('#request-delete-btn').click(function() {
    	var url = '/api/requests' + document.location.href.substring(document.location.href.lastIndexOf('/')) + '/delete'
        $.ajax({
            method: "DELETE",
            contentType: "application/x-www-form-urlencoded",
            url: url,
            success: function(response, textStatus, jqXHR) {
                if (response) {
                    window.location.href = JSON.parse(response).redirect;
                }
            }
        });
    });

		// Format the phone numbers
		$('span.phones').each(function(index) {
			var formattedPhones = [];
			$.each($(this).text().split(', '), function(_, phone) {
				var formattedPhone = intlTelInputUtils.formatNumber(phone, null, intlTelInputUtils.numberFormat.INTERNATIONAL);
				formattedPhones.push(formattedPhone);
			});
			$(this).text(formattedPhones.join(', '));
		});
});
