/* jshint node: true */
'use strict';

require(__dirname + '/../setup');

var storeWarnings = require(__dirname + '/storeWarnings');
var countries = require(__dirname + '/../config/countries');

var GoogleSpreadsheet = require('google-spreadsheet');
var sheet = new GoogleSpreadsheet(process.env.PC_SPREADSHEET_KEY);

function isDef(val) {
	return val && val !== '';
}

function isValid(row) {
	return	isDef(row.country) &&
					isDef(row.type) &&
					isDef(row.message) &&
					countries.codeList.indexOf(row.country.toUpperCase()) > -1 &&
					['Notice', 'Travel Plan', 'Restricted'].indexOf(row.type) > -1;
}

// Worksheet IDs start at 1 -> Get first sheet
sheet.getRows(1, function (err, rows) {
	if (err) { throw err; }

	var pcWarnings = [];

	rows.map(function (row) {
		if (isValid(row)) {
			pcWarnings.push({
				countryCode: row.country.toUpperCase().trim(),
				type: row.type.trim(),
				textOverview: row.message.trim(),
				link: (isDef(row.link) ? row.link.trim() : undefined),
				colorClass: (row.type.trim() === 'Restricted' ? 'alert-danger' :
					(row.type.trim() === 'Travel Plan' ? 'alert-warning' : 'alert-info')),
				startDate: (isDef(row.startdate) ? row.startdate : undefined),
				endDate: (isDef(row.enddate) ? row.enddate : undefined),
				source: 'Peace Corps',
			});
		}
	});

	storeWarnings(pcWarnings);
});
