/* jshint node: true */
'use strict';

var mongoose = require('mongoose');

var tokenSchema = mongoose.Schema({
	token: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	timestamp: {
		type: Date,
		required: true,
		default: Date.now,
	},
	token_type: {
		// false: password reset
		// true: registration
		type: Boolean,
		required: true,
		default: false,
	},
});

module.exports = mongoose.model('token', tokenSchema);
