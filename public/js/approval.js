$(document).ready(function() {
	$('.date').each(function(_, date) {
		var date_unf = $(date).data('unformatted');
		$(date).text(format_date(date_unf));
	});
});