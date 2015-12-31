

function strip_time(date) {
	return moment.utc(date).startOf('day').format('LL');
}

function format_date(date) {
	if (date === undefined) {
		return "None";
	} else {
		return moment(strip_time(date), 'LL').format("MMM DD, YYYY");
	}
}

function format_time(time) {
	if (time === undefined) {
		return "None";
	} else {
		console.log(time);
		return moment(time).format("LLL");
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