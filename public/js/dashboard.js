
function addRequest(id, request) {
	count = count + 1;
	$('div#' + id + " table").find('tbody').append(
		$('<tr>').append(
			$('<th>').text(count)
		).append(
			$('<td>').text((request.user && request.user.length > 0 ? request.user[0].name : "None"))
		).append(
			$('<td>').text(format_date(request.start_date))
		).append(
			$('<td>').text(format_date(request.end_date))
		).append(
			$('<td>').text(format_approval(request))
		).addClass(
			(request.is_pending ? "warning" : (request.is_approved ? "success" : "danger"))
		).click(function() {
			window.location.href = "/dashboard/requests/" + request._id;
		})
	);
}

function clearRequests(id) {
	$('table#' + id).empty();
}

function format_approval(request) {
	return (request.is_pending ? "Pending" : request.is_approved);
}

$(function() {
	count = 0
	$.each([{ url: '/api/requests', id: 'pending' }, { url: '/api/requests/past', id: 'past' }], function(_, d) {
		$.getJSON(d.url, function(request_list) {
	        for (index in request_list) {
	        	request = request_list[index]
	        	addRequest(d.id, request);
	        }
	    });
	});
	$('.nav-pills a').click(function (e) {
	  e.preventDefault()
	  $(this).tab('show')
	});
});

