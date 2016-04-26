/* globals describe */
/* globals it */
/* globals before */
/* globals after */
/* jshint node: true */
'use strict';

require(__dirname + '/../setup');

var assert = require('chai').assert;
var mongoose = require('mongoose');
var request = require('supertest');
var Access = require(__dirname + '/../config/access');

var mongoConnection = require(__dirname + '/../config/mongoConnection');
var serverObjects = require(__dirname + '/../bin/www');
var countries = require(__dirname + '/../config/countries');

var app = serverObjects.app;
var server = serverObjects.server;
var users;
var requests;
var agents;

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
	mongoose.createConnection(mongoConnection.getConnectionString());
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

function initializeAgents(done) {
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
}

before(function (done) {
	this.timeout(5000);
	setupDatabase(function (err, docs) {
		users = docs.users;
		requests = docs.requests;
		initializeAgents(done);
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
	var getCheckEndpointFunc = function (
		statusCodeExpected, failureStatusCodeExpected) {
		return function (endpoint) {
			if (endpoint.access !== undefined) {
				if (endpoint.access == Access.VOLUNTEER) {
					it('Volunteers can access GET ' + endpoint.url, function (done) {
						// Modify the endpoint, if necessary
						endpoint.url = endpoint.url.replace(':userId', agents.volunteer.user._id);
						endpoint.url = endpoint.url.replace(':requestId',
							requestWithName(requests,
								agents.volunteer.user.name, 'volunteer')[0]._id);

						agents.volunteer.request.get(endpoint.url)
							.redirects(1)
							.expect(statusCodeExpected, done);
					});
				} else {
					it('Volunteers can not access GET ' + endpoint.url, function (done) {
						agents.volunteer.request.get(endpoint.url)
							.redirects(0)
							.expect(failureStatusCodeExpected, done);
					});
				}

				if (endpoint.access <= Access.STAFF) {
					it('Staff can access GET ' + endpoint.url, function (done) {
						agents.staff.request.get(endpoint.url)
							.redirects(1)
							.expect(statusCodeExpected, done);
					});
				} else {
					it('Staff can not access GET ' + endpoint.url, function (done) {
						agents.staff.request.get(endpoint.url)
							.redirects(0)
							.expect(failureStatusCodeExpected, done);
					});
				}

				if (endpoint.access <= Access.ADMIN) {
					it('Admins can access GET ' + endpoint.url, function (done) {
						agents.admin.request.get(endpoint.url)
							.redirects(1)
							.expect(statusCodeExpected, done);
					});
				} else {
					it('Admins can not access GET ' + endpoint.url, function (done) {
						agents.admin.request.get(endpoint.url)
							.redirects(0)
							.expect(failureStatusCodeExpected, done);
					});
				}
			}
		};
	};

	endpoints.VIEWS.map(getCheckEndpointFunc(200, 302));
	endpoints.API.GET.map(getCheckEndpointFunc(200, 401));
	it('endpoints.api.post meet access restrictions');
	it('endpoints.api.delete meet access restrictions');
});

describe('GET /api/requests', function () {
	it('returns a valid request object', function (done) {
		agents.volunteer.request
			.get('/api/requests')
			.expect(200)
			.end(function (err, res) {
				if (err) {
					return done(err);
				}

				var requestList = res.body;
				assert.isArray(requestList);
				assert(requestList.length === 1,
					'Only one request exists by Ishaan that should be returned');
				var testRequest = requestList[0];
				assert(testRequest.startDate === 20160403);
				assert(testRequest.endDate === 20160410);
				assert(testRequest.status.isPending === true);
				assert(testRequest.status.isApproved === false);
				assert.isString(testRequest.timestamp);
				assert.isArray(testRequest.legs);
				assert(testRequest.legs.length === 1);
				assert(testRequest.legs[0].startDate === 20160403);
				assert(testRequest.legs[0].endDate === 20160410);
				assert(testRequest.legs[0].city === 'Chicago');
				assert(testRequest.legs[0].country === 'United States');
				assert(testRequest.legs[0].countryCode === 'US');
				assert(testRequest.legs[0].hotel === 'Test Hotel');
				assert(testRequest.legs[0].contact === 'Test Contact');
				assert(testRequest.legs[0].companions === 'Test Companion');
				assert(testRequest.legs[0].description === 'Test Description');
				assert.isArray(testRequest.comments);
				assert(testRequest.comments.length === 1);
				assert(testRequest.comments[0].name === 'Patrick Choquette');
				assert(testRequest.comments[0].user.name === 'Patrick Choquette');
				assert(testRequest.comments[0].content === 'I approve of this request.');
				assert.isString(testRequest.comments[0]._id);
				assert.isString(testRequest.comments[0].timestamp);
				assert(testRequest.counterpartApproved === true);
				assert(testRequest.staff.name === 'Patrick Choquette');
				assert(testRequest.volunteer.name === 'Ishaan Parikh');
				assert.isString(testRequest._id);
				done();
			});
	});

	it('requests for staff are limited by country', function (done) {
		agents.staff.request
			.get('/api/requests')
			.expect(200)
			.end(function (err, res) {
				if (err) {
					return done(err);
				}

				var requestList = res.body;
				assert(requestList.filter(function (u) {
					return u.volunteer.countryCode !== 'US';
				}).length === 0);
				assert(requestList.length === 2);
				done();
			});
	});

	it('requests for admins are not limited by country', function (done) {
		agents.admin.request
			.get('/api/requests')
			.expect(200)
			.end(function (err, res) {
				if (err) {
					return done(err);
				}

				var requestList = res.body;
				assert(requestList.filter(function (u) {
					return u.volunteer.countryCode !== 'US';
				}).length === 1);
				assert(requestList.length === 3);
				done();
			});
	});
});

describe('GET /api/requests/:requestId', function () {
	it('returns a correctly formatted request');
	it('returns the correct request');
});

describe('GET /api/users', function () {
	var verifyReturnedUserAccess = function (query, permittedAccess, done) {
		agents.admin.request
			.get(query)
			.expect(200)
			.end(function (err, res) {
				if (err) {
					return done(err);
				}

				var userList = res.body;

				if (permittedAccess.indexOf(Access.VOLUNTEER) !== -1) {
					assert(userList.filter(function (u) {
						return u.access === Access.VOLUNTEER;
					}).length > 0);
				} else {
					assert(userList.filter(function (u) {
						return u.access === Access.VOLUNTEER;
					}).length === 0);
				}

				if (permittedAccess.indexOf(Access.STAFF) !== -1) {
					assert(userList.filter(function (u) {
						return u.access === Access.STAFF;
					}).length > 0);
				} else {
					assert(userList.filter(function (u) {
						return u.access === Access.STAFF;
					}).length === 0);
				}

				if (permittedAccess.indexOf(Access.ADMIN) !== -1) {
					assert(userList.filter(function (u) {
						return u.access === Access.ADMIN;
					}).length > 0);
				} else {
					assert(userList.filter(function (u) {
						return u.access === Access.ADMIN;
					}).length === 0);
				}

				done();
			});
	};

	it('returns the correct user objects for admins', function (done) {
		agents.admin.request
			.get('/api/users')
			.expect(200)
			.end(function (err, res) {
				if (err) {
					return done(err);
				}

				var userList = res.body;
				assert.isArray(userList);
				assert(userList.length > 0);
				userList.map(function (testUser) {
					assert.isObject(testUser);
					assert.isString(testUser.name);
					assert.isString(testUser.email);
					assert.isString(testUser.countryCode);
					assert.isString(testUser.country);
					assert.isString(testUser._id);
					assert.isNumber(testUser.access);
					assert.isArray(testUser.phones);
				});

				assert(userList.filter(function (u) {
					return u.access === Access.VOLUNTEER;
				}).length > 0, 'At least one volunteer is returned');
				assert(userList.filter(function (u) {
					return u.access === Access.STAFF;
				}).length > 0, 'At least one staff is returned');
				assert(userList.filter(function (u) {
					return u.access === Access.ADMIN;
				}).length > 0, 'At least one admin is returned');
				done();
			});
	});

	it('returns the correct user objects for staff', function (done) {
		agents.staff.request
			.get('/api/users')
			.expect(200)
			.end(function (err, res) {
				if (err) {
					return done(err);
				}

				var userList = res.body;
				assert(userList.filter(function (u) {
					return u.access === Access.VOLUNTEER;
				}).length > 0, 'At least one volunteer is returned');
				assert(userList.filter(function (u) {
					return u.access === Access.STAFF;
				}).length > 0, 'At least one staff is returned');
				assert(userList.filter(function (u) {
					return u.access === Access.ADMIN;
				}).length > 0, 'At least one admin is returned');
				done();
			});
	});

	it('returns the correct user objects for volunteers', function (done) {
		agents.volunteer.request
			.get('/api/users')
			.expect(200)
			.end(function (err, res) {
				if (err) {
					return done(err);
				}

				var userList = res.body;
				assert(userList.filter(function (u) {
					return u.access === Access.VOLUNTEER;
				}).length > 0, 'At least one volunteer is returned');
				assert(userList.filter(function (u) {
					return u.access === Access.STAFF;
				}).length > 0, 'At least one staff is returned');
				assert(userList.filter(function (u) {
					return u.access === Access.ADMIN;
				}).length > 0, 'At least one admin is returned');
				done();
			});
	});

	// Waiting on issue #58 for spec of this endpoint
	it('limits to same country for volunteers');

	it('minAccess filters to just admins', function (done) {
		verifyReturnedUserAccess('/api/users?minAccess=2',
			[Access.ADMIN], done);
	});

	it('minAccess filters to just admins and staff', function (done) {
		verifyReturnedUserAccess('/api/users?minAccess=1',
			[Access.STAFF, Access.ADMIN], done);
	});

	it('minAccess does not filter when zero', function (done) {
		verifyReturnedUserAccess('/api/users?minAccess=0',
			[Access.VOLUNTEER, Access.STAFF, Access.ADMIN], done);
	});

	it('minAccess does not filter when < zero', function (done) {
		verifyReturnedUserAccess('/api/users?minAccess=-1',
			[Access.VOLUNTEER, Access.STAFF, Access.ADMIN], done);
	});

	it('minAccess returns nothing when > admin', function (done) {
		verifyReturnedUserAccess('/api/users?minAccess=3',
			[], done);
	});

	it('maxAccess filters to just volunteers', function (done) {
		verifyReturnedUserAccess('/api/users?maxAccess=0',
			[Access.VOLUNTEER], done);
	});

	it('maxAccess filters to just volunteers and staff', function (done) {
		verifyReturnedUserAccess('/api/users?maxAccess=1',
			[Access.STAFF, Access.VOLUNTEER], done);
	});

	it('maxAccess does not filter when = admin', function (done) {
		verifyReturnedUserAccess('/api/users?maxAccess=2',
			[Access.VOLUNTEER, Access.STAFF, Access.ADMIN], done);
	});

	it('maxAccess does not filter when > admin', function (done) {
		verifyReturnedUserAccess('/api/users?maxAccess=3',
			[Access.VOLUNTEER, Access.STAFF, Access.ADMIN], done);
	});

	it('maxAccess returns nothing when < zero', function (done) {
		verifyReturnedUserAccess('/api/users?maxAccess=-1',
			[], done);
	});
});

describe('GET /api/warnings', function () {
	it('returns a full warning object', function (done) {
		agents.admin.request
			.get('/api/warnings')
			.expect(200)
			.end(function (err, res) {
				if (err) {
					return done(err);
				}

				var warningList = res.body;
				assert.isObject(warningList);
				assert(Object.keys(warningList).length > 0);
				Object.keys(warningList).map(function (cc) {
					assert(warningList[cc].length > 0);
					warningList[cc].map(function (testWarning) {
						assert.isObject(testWarning);
						assert.isString(testWarning._id);
						assert.isString(testWarning.countryCode);
						assert.isString(testWarning.type);
						assert.isString(testWarning.textOverview);

						if (testWarning.link) {
							assert.isString(testWarning.link);
						}

						if (testWarning.startDate) {
							assert.isNumber(testWarning.startDate);
						}

						if (testWarning.endDate) {
							assert.isNumber(testWarning.startDate);
						}

						assert.isString(testWarning.colorClass);
						assert.isString(testWarning.source);
						assert.isString(testWarning.batchUUID);
						assert.isString(testWarning.timestamp);
					});
				});

				done();
			});
	});

	it('returns valid country keys', function (done) {
		agents.admin.request
			.get('/api/warnings')
			.expect(200)
			.end(function (err, res) {
				if (err) {
					return done(err);
				}

				var warningList = res.body;
				Object.keys(warningList).map(function (cc) {
					assert(countries.codeList.indexOf(cc) !== -1,
						cc + ' is not a valid country code');
				});

				done();
			});
	});
});

describe('POST /api/requests/:requestId/approve', function () {
	it('marks request as approved', function (done) {
		var n = requests.length;
		requests.map(function (request) {
			(function (request) {
				agents.admin.request
				.post('/api/requests/' + request._id + '/approve')
				.expect(200)
				.end(function (err) {
					if (err) {
						return done(err);
					}

					agents.admin.request
						.get('/api/requests/' + request._id)
						.expect(200)
						.end(function (err, res) {
							if (err) {
								return done(err);
							}

							assert(res.body.status.isApproved === true);
							assert(res.body.status.isPending === false);
							n--;
							if (n === 0) {
								done();
							}
						});
				});
			})(request);
		});
	});
});

describe('POST /api/requests/:requestId/deny', function () {
	it('marks request as denied', function (done) {
		var n = requests.length;
		requests.map(function (request) {
			(function (request) {
				agents.admin.request
				.post('/api/requests/' + request._id + '/deny')
				.expect(200)
				.end(function (err) {
					if (err) {
						return done(err);
					}

					agents.admin.request
						.get('/api/requests/' + request._id)
						.expect(200)
						.end(function (err, res) {
							if (err) {
								return done(err);
							}

							assert(res.body.status.isApproved === false);
							assert(res.body.status.isPending === false);
							n--;
							if (n === 0) {
								done();
							}
						});
				});
			})(request);
		});
	});
});

describe('POST /api/requests/:requestId/comments', function () {
	it('adds the full comment');
	it('comment is returned in /api/requests');
});

describe('POST /profile/:userId?', function () {

});

describe('POST /api/register', function () {

});

describe('POST /api/login', function () {
	it('fails with missing credentials');
	it('fails with incorrect credentials');
	it('redirects properly on failure');
});

describe('POST /api/logout', function () {
	it('logs the user out');
});

describe('POST /api/reset', function () {

});

describe('POST /api/reset/:token', function () {

});

describe('POST /api/requests', function () {

});

describe('POST /api/requests/:requestId', function () {

});

describe('POST /api/access', function () {

});

describe('POST /api/users', function () {

});

describe('POST /api/users/validate', function () {

});

describe('POST /api/requests/:requestId/delete', function () {

});

describe('POST /api/users', function () {

});

after(function (done) {
	server.close(function () {
		closeDatabase(function () {
			done();
		});
	});
});
