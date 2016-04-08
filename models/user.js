/* jshint node: true */
'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var fs = require('fs');

var Access = require(__dirname + '/../config/access');

var countryFilePath = __dirname + '/../public/data/countryList.json';
var countryListFile = fs.readFileSync(countryFilePath, 'utf8');
var countriesDictionary = JSON.parse(countryListFile);
var allCountryCodes = Object.keys(countriesDictionary);

var userSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
	},

	email: {
		type: String,

		// Prevent MongoDB from ever saving two duplicate emails
		index: {
			unique: true,
		},
	},
	phones: [String],
	hash: String,
	access: {
		type: Number,
		required: true,
		enum: Object.keys(Access),
	},
	countryCode: {
		type: String,
		required: true,
		enum: allCountryCodes,
	},
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
