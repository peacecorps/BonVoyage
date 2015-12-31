
var UTC_FORMAT = 'ddd MMM DD YYYY';
var UTC_FORMAT_TIME = 'ddd MMM DD YYYY HH:mm:ss zZZ';
var ISO_FORMAT = 'YYYY-MM-DD';

function strip_time(date, format) {
	return moment(date, format).startOf('day');
}

function format_date(date, format) {
	if (date === undefined) {
		return "None";
	} else {
		return strip_time(date, format).format("MMM DD, YYYY");
	}
}

function format_time(time, format) {
	if (time === undefined) {
		return "None";
	} else {
		return moment(time, format).format("LLL");
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