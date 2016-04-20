/* globals describe */
/* globals it */
/* globals before */
/* globals after */
/* jshint node: true */

require(__dirname + '/../setup');

var assert = require('chai').assert;
var request = require('superagent');
var mongoose = require('mongoose');

var buildUserBase = require(__dirname +
	'/../build_scripts/buildUserBase.js');
var buildRequestBase = require(__dirname +
	'/../build_scripts/buildRequestBase.js');
var clearDatabase = require(__dirname +
	'/../build_scripts/clearDatabase.js');

var BASE_URL = 'http://localhost:3000';

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

describe('API endpoints redirect when not logged in', function () {
	'use strict';

	var endpoints = {
		VIEWS: [
			'/dashboard',
			'/dashboard/submit',
			'/requests/:requestId',
			'/requests/:requestId/edit',
			'/users',
			'/users/add',
			'/profile',
			'/profile/:userId',
		],
		API: {
			GET: [
				'/api/requests',
				'/api/users',
				'/api/warnings',
			],
			POST: [
				'/api/requests/:requestId/approve',
				'/api/requests/:requestId/deny',
				'/api/requests/:requestId/comments',
				'/profile/',
				'/profile/:userId',
				'/api/requests',
				'/api/requests/:requestId',
				'/api/access',
				'/api/users',
				'/api/users/validate',
			],
			DELETE: [
				'/api/requests/:requestId/delete',
				'/api/users',
			],
		},
	};

	endpoints.VIEWS.map(function (endpoint) {
		it('GET ' + endpoint + ' redirects to /login', function (done) {
			request
				.get(BASE_URL + endpoint)
				.redirects(0)
				.end(function (err, res) {
					assert.equal(res.statusCode, 302);
					assert.equal(res.header.location, '/login');
					done();
				});
		});
	});

	endpoints.API.GET.map(function (endpoint) {
		it('GET ' + endpoint + ' returns 401', function (done) {
			request
				.get(BASE_URL + endpoint)
				.redirects(0)
				.end(function (err, res) {
					assert.equal(res.statusCode, 401);
					done();
				});
		});
	});

	endpoints.API.POST.map(function (endpoint) {
		it('POST ' + endpoint + ' returns 401', function (done) {
			request
				.post(BASE_URL + endpoint)
				.redirects(0)
				.end(function (err, res) {
					assert.equal(res.statusCode, 401);
					done();
				});
		});
	});

	endpoints.API.DELETE.map(function (endpoint) {
		it('DELETE ' + endpoint + ' returns 401', function (done) {
			request
				.delete(BASE_URL + endpoint)
				.redirects(0)
				.end(function (err, res) {
					assert.equal(res.statusCode, 401);
					done();
				});
		});
	});
});

describe('/api/users', function () {
	'use strict';

	before(function (done) {
		setupDatabase(done);
	});

	it('returns contains a full user object', function () {
		request
			.get('http://localhost:3000/api/users')
			.end(function (err, res) {
			});
	});

	after(function () {
		closeDatabase();
	});
});
