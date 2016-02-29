/* globals console */
/* globals setTimeout */
/* globals ss */

$(function () {
	'use strict';

	function $table() {
		return $('div#addUsersTable table');
	}

	// Configure the past and present DataTables indivudally
	var table = $table().DataTable({
		data: [],
		order: [[0, 'asc']],
		dom:
			"<'row'>" +
			"<'row'<'col-sm-12'tr>>" +
			"<'row'<'col-sm-4 hidden-xs'i><'col-sm-8 col-xs-12'p>" +
				"<'col-xs-12 visible-xs'i>>",
		language: {
			emptyTable: 'No users to add.',
			infoFiltered: '(filtered from _MAX_ users)',
			zeroRecords: 'No matching users found',
			info: 'Showing _START_ to _END_ of _TOTAL_ users',
			lengthMenu: 'Show _MENU_ users',
			infoEmpty: 'Showing 0 to 0 of 0 users',
		},
		columns: [
			{
				data: 'name',
				render: function(data) {
					return data.value;
				}
			},
			{
				data: 'email',
				render: function(data) {
					return data.value;
				}
			},
			{
				data: 'access',
				render: function(data) {
					if(data === 0) { return "Volunteer"; }
					else if(data === 1) { return "Supervisor"; }
					else if(data === 2) { return "Admin"; }
					else { return "None"; }
				},
			},
			{
				data: 'countryCode',
				render: function(data) {
					return data.value;
				},
			},
		],
	});

	var defaultText = $('#userUploader').text();

	/* jshint -W031 */
	new ss.SimpleUpload({
		button: $('#userUploader'), // file upload button
		url: '/api/users/validate', // server side handler
		name: 'users', // upload parameter name
		responseType: 'json',
		allowedExtensions: ['csv'],
		// Allow upload of the following, possible, CSV files
		accept: 'text/*, application/csv, application/excel, application/vnd.ms-excel, application/vnd.msexcel',
		maxSize: 1024, // in kilobytes
		// hoverClass: 'hover',
		// focusClass: 'focused',
		disabledClass: 'disabled',
		debug: true,
		onSubmit: function() {
			$('#userUploader').text('Uploading...');
		},
		onComplete: function(filename, response) {
			if (!response) {
				$('#userUploader').text("Upload failed.");
			} else {
				$('#userUploader').text("Success!");
				setTimeout(function() {
					$('#userUploader').text(defaultText);
				}, 2000);

				// Insert the response data into the table
				if(response.length > 0) {
					table.rows.add(response).draw();
					$('#createUsers').removeClass('disabled');
				}

			}
		},
		onError: function() {
			$('#userUploader').text("An error has occurred!");
			setTimeout(function() {
				$('#userUploader').text(defaultText);
			}, 1000);
		}
	});
	/* jshint +W031 */

	$('#createUsers').on('click', function(event) {
		if(!$(this).hasClass('disabled')) {
			$(this).text('Creating users...');
			$(this).addClass('disabled');

			// Submit AJAX request with data from datatable
			// TODO
			
			event.preventDefault();
		}
	});
});
