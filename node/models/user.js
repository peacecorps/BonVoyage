
var mongoose = require("mongoose");
var bcrypt = require("bcrypt-nodejs");

var user_schema = mongoose.Schema({
	name: String,
	email: String,
	hash: String
});

var presave = function(finish_saving_callback) {

	
	// assume the password with an unhashed string
	// step one add the salt

	bcrypt.genSalt(10, function(err, salt) {

		brypt.hash(salt, this.hash, function(err, hash));

	});

	//change password to hash	



	// Do anything before saving the data
	// ...
	finish_saving_callback();
});

user_schema.pre("save", presave);

module.exports = mongoose.model("user", user_schema);