
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
		$(date).text(format_date(date_unf));
	});
	// Format the timestamps for the comments
	$('.timestamp').each(function(_, time) {
		var time_unf = $(time).data('unformatted');
		$(time).text(format_time(time_unf));
	});


    $('#request-approve-btn').click(function() {
        $.ajax({
            method: "POST",
            contentType: "application/x-www-form-urlencoded",
            url: '/api/requests' + document.location.href.substring(document.location.href.lastIndexOf('/')) + '/approve',
            success: function(response, textStatus, jqXHR) {
                // if (err) console.log(err);
                // console.log(response);
                if (response.redirect) {
                    // response.redirect contains the string URL to redirect to
                    window.location.href = response.redirect;
                }
            }
        });
    });

    $('#request-deny-btn').click(function() {
        $.ajax({
            method: "POST",
            contentType: "application/x-www-form-urlencoded",
            url: '/api/requests' + document.location.href.substring(document.location.href.lastIndexOf('/')) + '/deny',
            success: function(response, textStatus, jqXHR) {
                // if (err) console.log(err);
                // console.log(response);
                if (response.redirect) {
                    // response.redirect contains the string URL to redirect to
                    window.location.href = response.redirect;
                }
            }
        });
    });

});

