/* globals describe */
/* globals it */
/* globals before */
/* globals after */
/* jshint node: true */

require(__dirname + '/../setup');

var assert = require('chai').assert;
var mongoose = require('mongoose');
var buildUserBase = require(__dirname +
	'/../build_scripts/buildUserBase.js');
var buildRequestBase = require(__dirname +
	'/../build_scripts/buildRequestBase.js');
var clearDatabase = require(__dirname +
	'/../build_scripts/clearDatabase.js');

function closeDatabase() {
	'use strict';

	mongoose.connection.close();
}

function setupDatabase(done) {
	'use strict';

	mongoose.connect(process.env.MONGO_TEST_CONNECTION_STRING);
	mongoose.connection.on('error', function (err) {
		closeDatabase();
		done(err);
	});

	mongoose.connection.on('connected', function () {
		clearDatabase(function (err) {
			if (err) {
				console.error(err);
				closeDatabase();
			} else {
				buildUserBase(function (err) {
					if (err) {
						console.error(err);
						closeDatabase();
					} else {
						buildRequestBase({
							nrequests: 5,
						}, function (err) {
							if (err) {
								console.error(err);
								closeDatabase();
							} else {
								done(null);
							}
						});
					}
				});
			}
		});
	});
}

describe('/api/users', function () {
	'use strict';

	before(function (done) {
		setupDatabase(done);
	});

	it('returns a user', function () {
		assert.equal(1, 1);
	});

	after(function () {
		closeDatabase();
	});
});
