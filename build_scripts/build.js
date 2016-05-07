/* jshint node: true */
'use strict';

require(__dirname + '/../setup');

var mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_DEV_CONNECTION_STRING);
mongoose.connection.on('error', function (err) {
	if (err) {
		console.log(err);
	}
});

var buildUserBase = require(__dirname + '/buildUserBase.js');
var buildRequestBase = require(__dirname + '/buildRequestBase.js');
var clearDatabase = require(__dirname + '/clearDatabase.js');

clearDatabase(function (err) {
	if (err) {
		console.error(err);
	} else {
		buildUserBase(function (err) {
			if (err) {
				console.error(err);
			} else {
				buildRequestBase({}, function (err) {
					if (err) {
						console.error(err);
					} else {
						mongoose.connection.close();
					}
				});
			}
		});
	}
});
