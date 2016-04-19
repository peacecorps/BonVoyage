/* jshint node: true */
'use strict';
module.exports = function (done) {
	var User = require(__dirname + '/../models/user');
	var Request = require(__dirname + '/../models/request');

	User.remove({}, function (err) {
		if (err) {
			done(err);
		} else {
			Request.remove({}, function (err) {
				if (err) {
					done(err);
				} else {
					done(null);
				}
			});
		}
	});
};
