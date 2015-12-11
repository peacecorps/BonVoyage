var mongoose = require("mongoose");


var request_schema = mongoose.Schema({
	email: String,
	start_date: Date,
	end_date: Date,
	timestamp: {type: Date, default: Date.now},
	is_pending: Boolean,
	is_approved: Boolean,
	description: String,
	country: String,
	comments: [{
		email: String,
		content: String,
		timestamp: {type: Date, default: Date.now}
	}]
});

module.exports = mongoose.model("request",request_schema);
