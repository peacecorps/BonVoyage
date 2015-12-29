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
		description: String
	}],

	comments: [{
		email: String,
		content: String,
		timestamp: {type: Date, default: Date.now}
	}]
});

request_schema.virtual('start_date').get(function() {
	start_date = legs[0].start_date;
	for (var i = 1; i < this.legs.length; i++) {
		if (legs[i].start_date.isBefore(start_date))
			start_date = legs[i].start_date;
	}
	return start_date;
});

request_schema.virtual('end_date').get(function() {
	end_date = legs[0].end_date;
	for (var i = 1; i < this.legs.length; i++) {
		if (legs[i].end_date.isBefore(end_date))
			end_date = legs[i].end_date;
	}
	return end_date;
});

module.exports = mongoose.model("request",request_schema);
