
function $table() {
	return $('div#dashboardTable table');
}

$(function() {
	// Configure the past and present DataTables indivudally
	var table = $table().DataTable({
		// responsive: true, // TODO
		ajax: {
			url: '/api/requests',
			dataSrc: ''
		},
		order: [[3, 'desc'], [1, 'asc'], [0, 'asc']],
		// lengthChange: false,
		language: {
			emptyTable: 'No requests found.',
			infoFiltered: "(filtered from _MAX_ requests)",
			zeroRecords: "No matching requests found",
			info: "Showing _START_ to _END_ of _TOTAL_ requests",
			lengthMenu: "Show _MENU_ requests"
		},
		columns: [
			{
				data: 'user',
				render: function(data, type, row) {
					if (data && data.length > 0) {
						return data[0].name;
					} else {
						return 'None';
					}
				}
			},
			{
				data: 'start_date',
				render: function(data, type, row) {
					return format_dateonly(data);
				}
			},
			{
				data: 'end_date',
				render: function(data, type, row) {
					return format_dateonly(data);
				}
			},
			{
				data: 'status',
				render: function(data, type, row) {
					return (data.is_pending ? "Pending" : (data.is_approved ? "Approved" : "Denied"));
				}
			}
		],
		"rowCallback": function( row, data, index ) {

			// Add Bootstrap coloration
			if (data.status.is_pending == true) {
				$(row).addClass('warning');
			} else {
				if (data.status.is_approved == true) {
					$(row).addClass('success');
				} else {
					$(row).addClass('danger');
				}
			}

			// Add click handler
			(function(data) {
				$(row).click(function(event) {
					window.location.href = "/requests/" + data._id;
				});
			})(data);
		}
	});
});

