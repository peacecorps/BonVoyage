/* global format_time */
/* global format_dateonly */
/* global UTC_FORMAT_TIME */
/* global window */
/* global document */
/* global reviewer */
/* global intlTelInputUtils */

// Dynamically disable the comment button if the textarea is empty
function commentStoppedTyping() { // jshint ignore:line
	'use strict';
	if($('#new-comment').val().length > 0) {
		$('#submit-comment').removeClass('disabled');
	} else {
		$('#submit-comment').addClass('disabled');
	}
}

$(function() {
	'use strict';
	// Format the dates for the trip itinerary
	$('.date').each(function(_, date) {
		var date_unf = $(date).data('unformatted');
		$(date).text(format_dateonly(date_unf));
	});
	// Format the timestamps for the comments
	$('.timestamp').each(function(_, time) {
		var time_unf = $(time).data('unformatted');
		$(time).text(format_time(time_unf, UTC_FORMAT_TIME));
	});
	// Set the link to the edit page
	$('.editLink').attr('href', document.location.href + '/edit');

	var defaultOption = {
		_id: 'none',
		isNone: true,
		name: 'None -- this is the final approval',
		label: 'Default',
		optgroup: 'noReviewer',
	};

	var $selectReviewer;
	var potentialReviewers;

	var checkboxState = { PENDING: 'PENDING', APPROVED: 'APPROVED', DENIED: 'DENIED' };

	// Determine if Pending, Approved or Denied is checked
	function getCheckboxState() {
		if ($('#pendingCheckbox').is(':checked')) {
			return checkboxState.PENDING;
		} else if ($('#approvalCheckbox').is(':checked')) {
			return checkboxState.APPROVED;
		} else {
			return checkboxState.DENIED;
		}
	}

	function getApprovalFormData() {
		var data = {
			approval: getCheckboxState(),
			comment: $('#explanation').val(),
			reviewer: (getCheckboxState() !== checkboxState.DENIED ? $selectReviewer.items[0] : 'none'),
		};
		return data;
	}

	function updateFromCheckboxState() {

		// Get the currently checked state
		var checkedState = getCheckboxState();
		// Get the currently selected reviewer
		var currentReviewer = $selectReviewer.items[0];

		// Switch on the checkbox state
		if (checkedState === checkboxState.DENIED) {
			// Hide the reassign dropdown
			$('#reviewer').addClass('hidden');
		} else {
			// Show the reassign dropdown
			$('#reviewer').removeClass('hidden');
			var newOptions = potentialReviewers;
			var selectedReviewer = defaultOption._id;
			if (checkedState == checkboxState.PENDING) {
				// Don't add the "none" option
				// if previously selected "none" then select the current user
				selectedReviewer = reviewer._id;
			} else if (checkedState == checkboxState.APPROVED) {
				// Show the "none" option
				newOptions.push(defaultOption);
			}

			if (currentReviewer && currentReviewer !== defaultOption._id) {
				selectedReviewer = currentReviewer;
			}

			$selectReviewer.addOption(newOptions);
			$selectReviewer.addItem(selectedReviewer);
			$selectReviewer.refreshOptions(false);
		}
	}

	function handleApprovalFormChange() {
		updateFromCheckboxState();
		var approvalData = getApprovalFormData();
		var approvalText, buttonClass, icon;

		if (approvalData.approval === checkboxState.APPROVED) {
			buttonClass = 'btn-success';
			if (approvalData.reviewer === 'none') {
				icon = 'fa-paper-plane';
				approvalText = 'Send Final Approval to PCV';
			} else {
				icon = 'fa-users';
				approvalText = 'Approve and Reassign';
			}
		} else {
			icon = 'fa-paper-plane';
			if (approvalData.approval === checkboxState.DENIED) {
				buttonClass = 'btn-danger';
				approvalText = 'Send Final Denial to PCV';
			} else {
				// Pending
				buttonClass = 'btn-warning';
				approvalText = 'Reassign and Comment';
			}
		}

		$('#request-approval-btn').removeClass('btn-success btn-danger btn-warning');
		$('#request-approval-btn').addClass(buttonClass);
		$('#request-approval-btn').html('<span class="fa ' + icon + '"></span> ' + approvalText);
	}

	if ($('#selectReviewer').length == 1) {
		$('input[type=radio]').change(handleApprovalFormChange);

		$selectReviewer = $('#selectReviewer').selectize({
			valueField: '_id',
			labelField: 'name',
			searchField: ['name'],
			lockOptgroupOrder: true,
			// Let the "None" field bubble up
			sortField: [ { field: 'isNone', direction: 'desc' }, { field: 'name' } ],
			optgroups: [
				{ value: 'noReviewer', label: 'No Reviewer' },
				{ value: 'selectReviewer', label: 'Potential Reviewers' },
			],
			onChange: handleApprovalFormChange,
		})[0].selectize;

		$.ajax({
			method: "GET",
			url: "/api/users?minAccess=1&maxAccess=1",
			dataType: "json",
			success: function(json) {
				for (var i = 0; i < json.length; i++) {
					json[i].isNone = false;
					json[i].optgroup = 'selectReviewer';
				}
				potentialReviewers = json;
				updateFromCheckboxState();
			}
		});
	}

	$('#submit-comment').click(function() {
		var url = '/api/requests' + document.location.href.substring(document.location.href.lastIndexOf('/')) + '/comments';
		var data = $('#new-comment').val();
		$.ajax({
			method: "POST",
			contentType: "application/x-www-form-urlencoded",
			url: url,
			data: { content: data },
			success: function(response) {
				if (response) {
					window.location.href = response.redirect;
				}
			}
		});
	});

	$('#request-approval-btn').click(function() {
		var url = '/api/requests' + document.location.href.substring(document.location.href.lastIndexOf('/')) + '/approval';
		$.ajax({
			method: "POST",
			contentType: "application/x-www-form-urlencoded",
			data: getApprovalFormData(),
			url: url,
			success: function(response) {
				if (response && response.redirect) {
					window.location.href = response.redirect;
				}
			}
		});
	});

	// $('#request-deny-btn').click(function() {
	// 	var url = '/api/requests' + document.location.href.substring(document.location.href.lastIndexOf('/')) + '/deny';
	// 	$.ajax({
	// 		method: "POST",
	// 		contentType: "application/x-www-form-urlencoded",
	// 		url: url,
	// 		success: function(response) {
	// 			if (response && response.redirect) {
	// 				window.location.href = response.redirect;
	// 			}
	// 		}
	// 	});
	// });

	$('#request-delete-btn').click(function() {
		var url = '/api/requests' + document.location.href.substring(document.location.href.lastIndexOf('/'));
		$.ajax({
			method: "DELETE",
			contentType: "application/x-www-form-urlencoded",
			url: url,
			success: function(response) {
				if (response && response.redirect) {
					window.location.href = response.redirect;
				}
			}
		});
	});

	// Format the phone numbers
	$('span.phones').each(function() {
		var formattedPhones = [];
		$.each($(this).text().split(', '), function(_, phone) {
			var formattedPhone = intlTelInputUtils.formatNumber(phone, null, intlTelInputUtils.numberFormat.INTERNATIONAL);
			formattedPhones.push(formattedPhone);
		});
		$(this).text(formattedPhones.join(', '));
	});
});
