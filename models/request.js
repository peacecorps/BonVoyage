var mongoose = require("mongoose");
var moment = require('moment');

var request_schema = mongoose.Schema({
	email: String,
	is_pending: Boolean,
	is_approved: Boolean,
	timestamp: {type: Date, default: Date.now},

	legs: [{
		start_date: Date,
		end_date: Date,
		country: String,
		country_code: String,
		hotel: String,
		contact: String,
		companions: String,
		description: String
	}],

	comments: [{
		name: String,
		email: String,
		content: String,
		timestamp: {type: Date, default: Date.now}
	}]
});

module.exports = mongoose.model("request",request_schema);
