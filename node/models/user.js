
var mongoose = require("mongoose");
var bcrypt = require("bcrypt-nodejs");

var user_schema = mongoose.Schema({
	name: String,
	email: String,
	password: String,
	hash: String,
	group: String
});

var presave = function(finish_saving_callback) {
	var current_user = this;
	console.log("presave");
	bcrypt.genSalt(10, function(err, salt) {
		// console.log(salt);
		bcrypt.hash(current_user.password, salt, null, function(err, password_hash){
			// console.log(password_hash);
			current_user.hash = password_hash;
			finish_saving_callback();
		})
	});
	
	
};

user_schema.methods.comparePassword = function(password, cb){
	var current_user = this;
	bcrypt.compare(password, current_user.hash, cb);
};

user_schema.pre("save", presave);

module.exports = mongoose.model("user", user_schema);