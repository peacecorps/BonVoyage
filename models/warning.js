/* jshint node: true */
'use strict';

var mongoose = require('mongoose');
var DateOnly = require('mongoose-dateonly')(mongoose);

// var path = require('path');
var validate = require('mongoose-validator');
var countries = require(__dirname + '/../config/countries');

var warningSchema = mongoose.Schema({
	countryCode: {
		type: String,
		required: true,
		enum: countries.codeList,
	},
	type: {
		type: String,
		required: true,
		enum: ['Restricted', 'Travel Plan', 'Notice', 'Alert', 'Warning'],
	},
	colorClass: {
		type: String,
		required: true,
		enum: ['alert-info', 'alert-danger', 'alert-warning'],
	},
	source: {
		type: String,
		required: true,
		enum: ['Peace Corps', 'US State Department'],
	},
	textOverview: { type: String, },
	text: { type: String, },
	link: {
		type: String,
		validate: [
			validate({
				validator: 'isURL',
			}),
		],
	},
	startDate: { type: DateOnly, },
	endDate: { type: DateOnly, },
	timestamp: { type: Date, default: Date.now },
	batchUUID: { type: String, required: true, },
});

module.exports = mongoose.model('warning', warningSchema);
