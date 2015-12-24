
function addRequest(request) {
	count = count + 1;
	$('table').find('tbody').append(
		$('<tr>').append(
			$('<td>').text(count)
		).append(
			$('<td>').text(request.email)
		).append(
			$('<td>').text(request.country)
		).append(
			$('<td>').text(format_date(request.start_date))
		).append(
			$('<td>').text(format_date(request.end_date))
		).append(
			$('<td>').text(format_approval(request))
		)
	);
}

function clearRequests(id) {
	$(id);
}

function format_approval(request) {
	return (request.is_pending ? "Pending" : request.is_approved);
}

function format_date(date) {
	d = moment(date);
	return d.format("MMM DD, YYYY");
}

$(document).ready(function() {
	count = 0
	$.getJSON('/requests', function(request_list) {
		console.log(request_list);
        for (index in request_list) {
        	console.log(request_list[index]);
        	request = request_list[index]
        	addRequest(request);
        }
    });
});