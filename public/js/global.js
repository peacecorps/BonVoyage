

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