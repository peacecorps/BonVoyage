/* jshint node: true */
'use strict';

var mongoose = require('mongoose');

var tokenSchema = mongoose.Schema({
	token: {
		type: String,
		required: true,
	},
	name: {
		type: String,
	},
	email: {
		type: String,
		required: true,
	},
	country: {
		type: String,
		required: true,
		default: 'US',
	},
	timestamp: {
		type: Date,
		required: true,
		default: Date.now,
	},
	tokenType: {
		// false: password reset
		// true: registration
		type: Boolean,
		required: true,
		default: false,
	},
});

module.exports = mongoose.model('token', tokenSchema);
