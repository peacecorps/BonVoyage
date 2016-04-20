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
				done(err);
			} else {
				buildUserBase(function (err) {
					if (err) {
						console.error(err);
						closeDatabase();
						done(err);
					} else {
						buildRequestBase({
							nrequests: 5,
						}, function (err) {
							if (err) {
								console.error(err);
								closeDatabase();
								done(err);
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

describe('Endpoints redirect when not logged in', function () {
	'use strict';

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

describe.skip('Other endpoints redirect when logged in', function () {

});

describe('404 errors', function () {
	'use strict';

	it.skip('Redirects to the error page', function (done) {
		request
			.get(BASE_URL + '/some/nonexistant/page')
			.end(function (err, res) {
				assert.equal(res.header.location, '/errors/404');
				done();
			});
	});
});

describe.skip('Limits access to proper access level', function () {

});

describe('/api/users', function () {
	'use strict';

	before(function (done) {
		this.timeout(5000);
		setupDatabase(done);
	});

	it.skip('returns contains a full user object', function (done) {
		request
			.get('http://localhost:3000/api/users')
			.end(function (err, res) {
				done();
			});
	});

	it('minAccess filters user list');
	it('maxAccess filters user list');

	after(function () {
		closeDatabase();
	});
});

describe.skip('/login', function () {

});

describe.skip('/register', function () {

});

describe.skip('/reset', function () {

});

describe.skip('/dashboard', function () {

});

describe.skip('/dashboard/submit and /requests/:requestId/edit', function () {

});

describe.skip('/requests', function () {

});

describe.skip('/users', function () {

});

describe.skip('/users/add', function () {

});

describe.skip('/profile', function () {

});

describe.skip('/api/requests', function () {

});

describe.skip('/api/users', function () {

});

describe.skip('/api/warnings', function () {

});

describe.skip('/api/requests/:requestId/approve', function () {

});

describe.skip('/api/requests/:requestId/deny', function () {

});

describe.skip('/api/requests/:requestId/comments', function () {

});

describe.skip('/profile/:userId?', function () {

});

describe.skip('/api/register', function () {

});

describe.skip('/api/login', function () {

});

describe.skip('/api/logout', function () {

});

describe.skip('/api/reset', function () {

});

describe.skip('/api/reset/:token', function () {

});

describe.skip('/api/requests', function () {

});

describe.skip('/api/requests/:requestId', function () {

});

describe.skip('/api/access', function () {

});

describe.skip('/api/users', function () {

});

describe.skip('/api/users/validate', function () {

});

describe.skip('/api/requests/:requestId/delete', function () {

});

describe.skip('/api/users', function () {

});
