/* globals describe */
/* globals it */
/* globals before */
/* globals after */
/* jshint node: true */
'use strict';

require(__dirname + '/../setup');
process.env.NODE_ENV = 'test';

var assert = require('chai').assert;
var mongoose = require('mongoose');
var request = require('supertest');
var Access = require(__dirname + '/../config/access');

var serverObjects = require(__dirname + '/../bin/www');
var app = serverObjects.app;
var server = serverObjects.server;
var users;
var requests;

var buildUserBase = require(__dirname +
	'/../build_scripts/buildUserBase.js');
var buildRequestBase = require(__dirname +
	'/../build_scripts/buildRequestBase.js');
var clearDatabase = require(__dirname +
	'/../build_scripts/clearDatabase.js');

var endpoints = {
	VIEWS: [
		{ url: '/dashboard', access: Access.VOLUNTEER },
		{ url: '/dashboard/submit', access: Access.VOLUNTEER },
		{ url: '/requests/:requestId', access: Access.VOLUNTEER },
		{ url: '/requests/:requestId/edit', access: Access.VOLUNTEER },
		{ url: '/users', access: Access.STAFF },
		{ url: '/users/add', access: Access.STAFF },
		{ url: '/profile', access: Access.VOLUNTEER },
		{ url: '/profile/:userId', access: Access.VOLUNTEER },
	],
	API: {
		GET: [
			{ url: '/api/requests', access: Access.VOLUNTEER },
			{ url: '/api/users', access: Access.VOLUNTEER },
			{ url: '/api/warnings', access: Access.VOLUNTEER },
		],
		POST: [
			{ url: '/api/requests/:requestId/approve', access: Access.STAFF },
			{ url: '/api/requests/:requestId/deny', access: Access.STAFF },
			{ url: '/api/requests/:requestId/comments', access: Access.VOLUNTEER },
			{ url: '/profile/', access: Access.VOLUNTEER },
			{ url: '/profile/:userId', access: Access.VOLUNTEER },
			{ url: '/api/requests', access: Access.VOLUNTEER },
			{ url: '/api/requests/:requestId', access: Access.VOLUNTEER },
			{ url: '/api/access', access: Access.STAFF },
			{ url: '/api/users', access: Access.STAFF },
			{ url: '/api/users/validate', access: Access.STAFF },
		],
		DELETE: [
			{ url: '/api/requests/:requestId/delete', access: Access.VOLUNTEER },
			{ url: '/api/users', access: Access.VOLUNTEER },
		],
	},
	NO_LOGIN: [
		{ url: '/' },
		{ url: '/login' },
		{ url: '/register/:email/:token' },
		{ url: '/reset' },
		{ url: '/reset/:token' },
	],
};

function closeDatabase(done) {
	mongoose.disconnect(done);
}

function setupDatabase(done) {
	mongoose.createConnection(process.env.MONGO_TEST_CONNECTION_STRING);
	mongoose.connection.on('error', function (err) {
		done(err);
	});

	mongoose.connection.on('connected', function () {
		clearDatabase(function (err) {
			if (err) {
				console.error(err);
				closeDatabase();
				done(err);
			} else {
				buildUserBase(function (err, users) {
					if (err) {
						console.error(err);
						closeDatabase();
						done(err);
					} else {
						buildRequestBase({
							random: false,
						}, function (err, requests) {
							if (err) {
								console.error(err);
								closeDatabase();
								done(err);
							} else {
								done(null, {
									users: users,
									requests: requests,
								});
							}
						});
					}
				});
			}
		});
	});
}

function userWithName(objects, name) {
	var foundUsers = objects.filter(function (object) {
		return object.name == name;
	});

	if (foundUsers.length !== 1) {
		throw Error('Did not find exactly one user with name: ' + name +
			' (found ' + foundUsers.length + ')');
	} else {
		return foundUsers[0];
	}
}

function requestWithName(requests, name, field) {
	var user = userWithName(users, name);

	var foundRequests = requests.filter(function (request) {
		return user._id.equals(request[field]);
	});

	if (foundRequests.length === 0) {
		throw Error('Could not find any requests for: ' + name);
	}

	return foundRequests;
}

before(function (done) {
	this.timeout(5000);
	setupDatabase(function (err, docs) {
		users = docs.users;
		requests = docs.requests;
		done(err);
	});
});

describe('Endpoints redirect when not logged in', function () {
	endpoints.VIEWS.map(function (endpoint) {
		it('GET ' + endpoint.url + ' redirects to /login', function (done) {
			request(app)
				.get(endpoint.url)
				.expect(302)
				.expect(function (res) {
					assert.equal(res.header.location, '/login');
				})
				.end(done);
		});
	});

	endpoints.API.GET.map(function (endpoint) {
		it('GET ' + endpoint.url + ' returns 401', function (done) {
			request(app)
				.get(endpoint.url)
				.expect(401, done);
		});
	});

	endpoints.API.POST.map(function (endpoint) {
		it('POST ' + endpoint.url + ' returns 401', function (done) {
			request(app)
				.post(endpoint.url)
				.expect(401, done);
		});
	});

	endpoints.API.DELETE.map(function (endpoint) {
		it('DELETE ' + endpoint.url + ' returns 401', function (done) {
			request(app)
				.delete(endpoint.url)
				.expect(401, done);
		});
	});
});

describe('Other endpoints redirect when logged in', function () {
	var agent = request.agent(app);

	before(function (done) {
		agent
			.post('/api/login')
			.send({ email: 'colink@umd.edu', password: 'colin' })
			.end(done);
	});

	endpoints.NO_LOGIN.map(function (endpoint) {
		it(endpoint.url + ' redirects to /dashboard if logged in', function (done) {
			agent
				.get(endpoint.url)
				.expect(302)
				.expect(function (res) {
					assert.equal(res.header.location, '/dashboard');
				})
				.end(done);
		});
	});
});

describe('/errors', function () {
	it.skip('Redirects to the error page', function (done) {
		request(app)
			.get('/some/nonexistant/page')
			.expect(302)
			.expect(function (res) {
				assert.equal(res.header.location, '/errors/404');
			})
			.end(done);
	});
});

describe('needAccess properly limits access level', function () {
	var agents;

	before(function (done) {
		agents = {
			volunteer: {
				request: request.agent(app),
				user: userWithName(users, 'Ishaan Parikh'),
			},
			staff: {
				request: request.agent(app),
				user: userWithName(users, 'Patrick Choquette'),
			},
			admin: {
				request: request.agent(app),
				user: userWithName(users, 'Colin King'),
			},
		};

		agents.volunteer.request
			.post('/api/login')
			.send({ email: 'ishaan@test.com', password: 'ishaan' })
			.end(function (err) {
				if (err) {
					return done(err);
				}

				agents.staff.request
					.post('/api/login')
					.send({ email: 'pchoquette@peacecorps.gov', password: 'patrick' })
					.end(function (err) {
						if (err) {
							return done(err);
						}

						agents.admin.request
							.post('/api/login')
							.send({ email: 'colink@umd.edu', password: 'colin' })
							.end(done);
					});
			});
	});

	var getCheckEndpointFunc = function (statusCodeExpected, requestType) {
		return function (endpoint) {
			if (endpoint.access !== undefined) {
				if (endpoint.access == Access.VOLUNTEER) {
					it('Volunteers can access ' + requestType +
						' ' + endpoint.url, function (done) {
						// Modify the endpoint, if necessary
						endpoint.url = endpoint.url.replace(':userId', agents.volunteer.user._id);
						endpoint.url = endpoint.url.replace(':requestId',
							requestWithName(requests,
								agents.volunteer.user.name, 'volunteer')[0]._id);

						agents.volunteer.request[requestType](endpoint.url)
							.redirects(1)
							.expect(statusCodeExpected, done);
					});
				}

				if (endpoint.access <= Access.STAFF) {
					it('Staff can access ' + requestType +
						' ' + endpoint.url, function (done) {
						agents.staff.request[requestType](endpoint.url)
							.redirects(1)
							.expect(statusCodeExpected, done);
					});
				}

				if (endpoint.access <= Access.ADMIN) {
					it('Admins can access ' + requestType +
						' ' + endpoint.url, function (done) {
						agents.admin.request[requestType](endpoint.url)
							.redirects(1)
							.expect(statusCodeExpected, done);
					});
				}
			}
		};
	};

	endpoints.VIEWS.map(getCheckEndpointFunc(200, 'get'));
	endpoints.API.GET.map(getCheckEndpointFunc(200, 'get'));
	it('endpoints.api.post meet access restrictions');
	it('endpoints.api.delete meet access restrictions');
});

describe('/api/requests', function () {

});

describe('/api/users', function () {

});

describe('/api/warnings', function () {

});

describe('/api/requests/:requestId/approve', function () {

});

describe('/api/requests/:requestId/deny', function () {

});

describe('/api/requests/:requestId/comments', function () {

});

describe('/profile/:userId?', function () {

});

describe('/api/register', function () {

});

describe('/api/login', function () {
	it('fails with missing credentials');
	it('fails with incorrect credentials');
	it('redirects properly on failure');
});

describe('/api/logout', function () {

});

describe('/api/reset', function () {

});

describe('/api/reset/:token', function () {

});

describe('/api/requests', function () {

});

describe('/api/requests/:requestId', function () {

});

describe('/api/access', function () {

});

describe('/api/users', function () {

});

describe('/api/users/validate', function () {

});

describe('/api/requests/:requestId/delete', function () {

});

describe('/api/users', function () {
	it('returns the correct user objects');
	it('limits to same country for volunteers');
	it('minAccess filters user list');
	it('maxAccess filters user list');
});

after(function (done) {

	server.close(function () {
		closeDatabase(function () {
			done();
		});
	});
});
