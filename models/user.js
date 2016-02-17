/* jshint node: true */
'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
	name: String,

	// Prevent MongoDB from ever saving two duplicate emails
	email: { type: String, index: { unique: true } },
	phone: String,
	hash: String,
	access: Number,
	countryCode: String,
});

var presave = function (callback) {
	var _this = this;
	console.log('presave');
	bcrypt.genSalt(10, function (err, salt) {
		// new passwords are set to the hash and then overwritten below
		var plainTextPassword = _this.hash;
		bcrypt.hash(plainTextPassword, salt, null, function (err, passwordHash) {
			// console.log(passwordHash);
			_this.hash = passwordHash;
			callback();
		});
	});
};

userSchema.methods.comparePassword = function (password, cb) {
	var _this = this;
	bcrypt.compare(password, _this.hash, cb);
};

userSchema.pre('save', presave);

module.exports = mongoose.model('user', userSchema);
