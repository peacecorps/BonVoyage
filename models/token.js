var mongoose = require("mongoose");

var token_schema = mongoose.Schema({
	token: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	}
});

module.exports = mongoose.model("token",token_schema);
