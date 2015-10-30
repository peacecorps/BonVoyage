
var mongoose = require("mongoose");

var user_schema = mongoose.Schema({
	email: String,
	hash: String
});

module.exports = mongoose.model("user", user_schema);