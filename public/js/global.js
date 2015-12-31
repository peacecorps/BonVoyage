
var UTC_FORMAT = 'ddd MMM DD YYYY HH:mm:ss zZZ';

function strip_time(date, format) {
	return moment(date, format).startOf('day');
}

function format_date(date) {
	if (date === undefined) {
		return "None";
	} else {
		return strip_time(date, UTC_FORMAT).format("MMM DD, YYYY");
	}
}

function format_time(time) {
	if (time === undefined) {
		return "None";
	} else {
		return moment(time, UTC_FORMAT).format("LLL");
	}
}

$(function() {
	$('#logout').click(function() {
		$.ajax({
			method: "POST",
			url: "/api/logout",
			dataType: "json",
			success: function(resp) {
				if (resp.redirect)
					window.location.href = resp.redirect;
			}
		});
	});
});