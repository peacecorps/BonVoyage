/* jshint node: true */
'use strict';

var mongoose = require('mongoose');
var DateOnly = require('mongoose-dateonly')(mongoose);

var requestSchema = mongoose.Schema({
	userId: mongoose.Schema.Types.ObjectId,
	status: {
		isPending: Boolean,
		isApproved: Boolean,
	},
	timestamp: { type: Date, default: Date.now },

	legs: [
		{
			startDate: DateOnly,
			endDate: DateOnly,
			country: String,
			countryCode: String,
			hotel: String,
			contact: String,
			companions: String,
			description: String,
		},
	],

	comments: [
		{
			name: String,
			email: String,
			content: String,
			timestamp: { type: Date, default: Date.now },
		},
	],
});

module.exports = mongoose.model('request', requestSchema);
