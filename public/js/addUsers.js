/* globals console */
/* globals window */
/* globals ss */
/* jshint -W031 */

$(function () {
	'use strict';

	function $table() {
		return $('div#addUsersTable table');
	}

	// Configure the past and present DataTables indivudally
	var table = $table().DataTable({
		data: [],
		order: [[4, 'asc'],[0, 'asc']],
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
				data: 'countryCode',
				render: function(data) {
					return data.value;
				},
			},
			{
				data: 'access',
				render: function(data) {
					if(data.value === 0) { return "Volunteer"; }
					else if(data.value === 1) { return "Supervisor"; }
					else if(data.value === 2) { return "Admin"; }
					else { return "None"; }
				},
			},
			{
				data: 'valid',
				render: function(data) {
					return (data === true ? "YES" : "NO");
				},
			},
		],
		createdRow: function(row, data) {
			console.log(data);
			if(!data.valid) {
				$(row).addClass('danger');
				$('td', row).eq(4).addClass('danger');
				var tds = ['name', 'email', 'countryCode', 'access'];
				for(var i = 0; i < 4; i++) {
					if(data[tds[i]].valid === false) {
						$('td', row).eq(i).addClass('invalid');
					}
				}
			}
		}
	});

	function startLoading() {
		$('#icon span').addClass('hidden');
		$('#icon span#loading').removeClass('hidden');
	}

	function stopLoading(wasSuccess) {
		$('#icon span').addClass('hidden');
		if(wasSuccess === true) {
			$('#icon span#success').removeClass('hidden');
		} else {
			$('#icon span#error').removeClass('hidden');
		}
	}

	new ss.SimpleUpload({
		button: $('#uploader'), // file upload button
		dropzone: $('#uploader'), // file upload button
		url: '/api/users/validate', // server side handler
		name: 'users', // upload parameter name
		responseType: 'json',
		allowedExtensions: ['csv'],
		// Allow upload of the following, possible, CSV files
		accept: 'text/*, application/csv, application/excel, application/vnd.ms-excel, application/vnd.msexcel',
		maxSize: 1024, // in kilobytes
		hoverClass: 'hover',
		dragClass: 'hover',
		// focusClass: 'focused',
		disabledClass: 'disabled',
		debug: true,
		onSubmit: function() {
			startLoading();
		},
		onComplete: function(filename, response) {
			if (!response) {
				stopLoading(false);
				$('#uploader #title').text("Upload failed!");
			} else {
				stopLoading(true);
				$('#uploader #title').text("Success!");

				// Insert the response data into the table
				table.rows.add(response).draw();
				// Optionally show the submission button
				var allAreValid = response.every(function(user) { return user && user.valid; });
				if(response.length > 0) {
					$('#clearTable').removeClass('disabled');
				}
				if(response.length > 0 && allAreValid) {
					$('#createUsers').removeClass('disabled');
				} else {
					$('#createUsers').addClass('disabled');
				}
			}
		},
		onError: function() {
			stopLoading(false);
			$('#uploader #title').text("An error has occurred!");
		}
	});

	var defaultSubmissionText = $('#createUsers').text();

	$('#createUsers').on('click', function(event) {
		if(!$(this).hasClass('disabled')) {
			$(this).text('Creating users...');
			$(this).addClass('disabled');

			// Submit AJAX request with data from datatable
			var data = table.data().toArray();
			console.log(data);

			$.ajax({
				url: '/api/users',
				method: 'POST',
				contentType: 'application/json',
				data: JSON.stringify(data),
				dataType: 'json',
				success: function(response) {
					if(response && response.redirect) {
						window.location.href = response.redirect;
					} else {
						$(this).text(defaultSubmissionText);
						$(this).removeClass('disabled');
					}
				},
				error: function() {
					$(this).text(defaultSubmissionText);
					$(this).removeClass('disabled');
				}
			});

			event.preventDefault();
		}
	});

	$('#clearTable').on('click', function(event) {
		if(!$(this).hasClass('disabled')) {
			$(this).addClass('disabled');
			table.clear().draw();
		}

		event.preventDefault();
	});
});
