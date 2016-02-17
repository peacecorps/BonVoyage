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
});

module.exports = mongoose.model('token', tokenSchema);
