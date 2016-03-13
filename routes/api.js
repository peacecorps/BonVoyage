/* jshint node: true */
/* jshint loopfunc:true */
'use strict';

var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Request = require('../models/request');
var Token = require('../models/token');
var Access = require('../config/access');
var fs = require('fs');
var randtoken = require('rand-token');
var countryFilePath = './public/data/countryList.json';
var countryListFile = fs.readFileSync(countryFilePath, 'utf8');
var countriesDictionary = JSON.parse(countryListFile);
var helpers = require('./helpers');
var DateOnly = require('dateonly');
var Converter = require('csvtojson').Converter;

/*
 * Handle Parameters
 */
router.handleRequestId = function (req, res, next, requestId) {
	// console.log(req.query);
	// Look up requestId to determine if it is pending or not
	Request.findOne({ _id: requestId }, 'status', function (err, request) {
		if (err) {
			next(err);
		}

		helpers.getRequests(req, res, request.status.isPending,
			function (err, requests) {
			if (err) {
				next(err);
			} else {
				// Lookup the id in this list of requests
				for (var i = 0; i < requests.length; i++) {
					if (requests[i]._id == requestId) {
						req.request = requests[i];
						if (i < requests.length - 1) {
							req.nextRequestId = requests[i + 1]._id;
						}

						if (i > 0) {
							req.prevRequestId = requests[i - 1]._id;
						}

						next();
					}
				}

				if (req.request === undefined) {
					next(new Error('Request not found.'));
				}
			}
		});
	});
};

/*
 * GET Requests
 */
router.getRequests = function (req, res) {
	helpers.getRequests(req, res, undefined, function (err, requests) {
		if (err) {
			console.error(err);
		}

		res.send(requests);
	});
};

router.getPendingRequests = function (req, res) {
	helpers.getRequests(req, res, true, function (err, requests) {
		if (err) {
			console.error(err);
		}

		res.send(requests);
	});
};

router.getPastRequests = function (req, res) {
	helpers.getRequests(req, res, false, function (err, requests) {
		if (err) {
			console.error(err);
		}

		res.send(requests);
	});
};

router.getUsers = function (req, res) {
	var rawMaxAccess = req.query.maxAccess;
	var maxAccess = Access[rawMaxAccess];
	helpers.getUsers({
		maxAccess: maxAccess,
	}, function (err, users) {
		if (err) {
			console.error(err);
		}

		res.send(users);
	});
};

/*
 * POST Requests
 */

router.postRequests = function (req, res) {
	var userId = req.user._id;

	// Supervisors will select a user to submit a request for on the form
	if (req.user.access >= Access.SUPERVISOR) {
		userId = req.body.userId;
		if (userId === undefined) {
			req.session.submission = req.body;
			req.flash('submissionFlash', {
				text: 'You must select a requestee to submit this request for.',
				class: 'danger',
			});
			res.end(JSON.stringify({ redirect: '/dashboard/submit' }));
			return;
		}
	}

	// Verify that the user exists
	helpers.getUsers({
		user: {
			_id: userId,
		},
	}, function (err, users) {
		if (users.length > 0) {
			var legs = [];
			var countries = [];
			for (var i = 0; i < req.body.legs.length; i++) {
				var leg = req.body.legs[i];
				var start = new DateOnly(leg.startDate);
				var end = new DateOnly(leg.endDate);

				if (start > end) {
					req.session.submission = req.body;
					req.flash('submissionFlash', {
						text: 'The start date you entered for leg #' +
							(i + 1) + ' comes after the end date.',
						class: 'danger',
					});
					res.end(JSON.stringify({ redirect: '/dashboard/submit' }));
					return;
				} else if (Object.keys(countriesDictionary).indexOf(leg.country) == -1) {
					req.session.submission = req.body;
					req.flash('submissionFlash', {
						text: 'The country that you have selected for leg #' +
							(i + 1) + ' is not a valid country.',
						class: 'danger',
					});
					res.end(JSON.stringify({ redirect: '/dashboard/submit' }));
					return;
				}

				legs.push({
					startDate: start,
					endDate: end,
					country: countriesDictionary[leg.country],
					countryCode: leg.country,
					hotel: leg.hotel,
					contact: leg.contact,
					companions: leg.companions,
					description: leg.description,
				});

				countries.push(leg.country);
			}

			console.log(countries);

			if (legs.length > 0) {
				var newRequest = new Request({
					userId: userId,
					status: {
						isPending: true,
						isd: false,
					},
					legs: legs,
				});

				console.log(users);

				newRequest.save(function (err, obj) {
					if (err) {
						req.session.submission = req.body;
						req.flash('submissionFlash', {
							text: 'An error has occurred while trying to ' +
								'save this request. Please try again.',
							class: 'danger',
						});
						res.end(JSON.stringify({
							redirect: '/dashboard/submit',
						}));
					} else {
						// asynchronous
						// send SMS notification to a staff
						process.nextTick(function () {
							for (var i = 0; i < countries.length; i++) {
								User.find({ access: Access.SUPERVISOR,
								countryCode: countries[i], },
								function (err, docs) {
									for (var j = 0; j < docs.length; j++) {
										var msg = 'A request by ' +
											users[0].name + ' is waiting ' +
											'for your approval on BonVoyage.' +
											' http://localhost:3000/login';

										if (docs[j].phone) {
											helpers.sendSMS(docs[j].phone,
											msg);
										} else {
											console.log(docs[j].name +
											' does not have a phone number');
										}
									}
								});
							}
						});

						req.flash('dashboardFlash', {
							text: 'Request successfully saved.',
							class: 'success',
							link: {
								url: '/requests/' + obj._id,
								text: 'View Request.',
							},
						});
						res.end(JSON.stringify({ redirect: '/dashboard' }));
					}
				});
			} else {
				req.session.submission = req.body;
				req.flash('submissionFlash', {
					text: 'An error has occurred while trying to save ' +
						'this request. Please try again.',
					class: 'danger',
				});
				res.end(JSON.stringify({ redirect: '/dashboard/submit' }));
			}
		} else {
			req.session.submission = req.body;
			req.flash('submissionFlash', {
				text: 'The user that you selected could not be found.',
				class: 'danger',
			});
			res.end(JSON.stringify({ redirect: '/dashboard/submit' }));
			return;
		}
	});
};

router.postApprove = function (req, res) {
	var id = req.params.requestId;
	Request.findByIdAndUpdate(id, {
		$set: {
			'status.isPending': false,
			'status.isApproved': true,
		},
	}, function (err, doc) {
		if (err) {
			return res.send(500, { error: err });
		}

		User.findOne({ _id: doc.userId }, function (err, user) {
			var sendFrom = 'Peace Corps <team@projectdelta.io>';
			var sendTo = user.email;
			var subject = 'Peace Corps BonVoyage Request Approved';
			var map = {
				name: req.user.name.split(' ')[0],
				button: 'http://localhost:3000',
			};

			// asynchronous
			process.nextTick(function () {
				helpers.sendTemplateEmail(sendFrom, sendTo, subject,
				'approve', map);

				if (user.phone) {
					helpers.sendSMS(user.phone, 'Your BonVoyage ' +
						'leave request is now approved!');
				}
			});

			req.flash('dashboardFlash', {
				text: 'The request has been successfully approved.',
				class: 'success',
				link: {
					url: '/requests/' + id,
					text: 'View Request.',
				},
			});
			res.end(JSON.stringify({ redirect: '/dashboard' }));
		});
	});
};

router.postDeny = function (req, res) {
	var id = req.params.requestId;
	Request.findByIdAndUpdate(id, {
		$set: {
			'status.isPending': false,
			'status.isApproved': false,
		},
	}, function (err, doc) {
		if (err) {
			return res.send(500, { error: err });
		}

		User.findOne({ _id: doc.userId }, function (err, user) {
			var sendFrom = 'Peace Corps <team@projectdelta.io>';
			var sendTo = user.email;
			var subject = 'Peace Corps BonVoyage Request Denied';
			var map = {
				name: req.user.name.split(' ')[0],
				button: 'http://localhost:3000',
			};

			process.nextTick(function () {
				helpers.sendTemplateEmail(sendFrom, sendTo, subject,
				'deny', map);

				if (user.phone) {
					helpers.sendSMS(user.phone, 'Your BonVoyage leave request was denied.' +
						'Please reach out to the your supervisor if you have any questions.');
				}
			});

			req.flash('dashboardFlash', {
				text: 'The request has been successfully denied.',
				class: 'success',
				link: {
					url: '/requests/' + id,
					text: 'View Request.',
				},
			});
			res.end(JSON.stringify({ redirect: '/dashboard' }));
		});
	});
};

router.postDelete = function (req, res) {
	var id = req.params.requestId;
	Request.findOneAndRemove({ _id: id, userId: req.user._id }, function (err) {
		if (err) {
			return res.send(500, { error: err });
		}

		req.flash('dashboardFlash', {
			text: 'The request has been successfully deleted.',
			class: 'success',
			link: {
				url: '/requests/' + id,
				text: 'View Request.',
			},
		});
		res.end(JSON.stringify({ redirect: '/dashboard' }));
	});
};

router.postComments = function (req, res) {
	var id = req.params.requestId;
	Request.findByIdAndUpdate(id, { $push: {
		comments: {
			$each:[
				{
					name:req.user.name,
					email:req.user.email,
					content:req.param('content'),
				},
			],
		},
	}, }, function (err) {
		if (err) {
			return res.send(500, { error: err });
		}

		req.flash('approvalFlash', {
			text: 'Your comment has been added.',
			class: 'success',
		});
		res.end(JSON.stringify({ redirect: '/requests/' + id }));
	});
};

router.reset = function (req, res) {
	var email = req.body.email;

	// first check if email is registered
	User.findOne({ email: email }, function (err, user) {
		if (err) {
			req.flash('loginFlash', {
				text: 'The account you are looking for does not exist ' +
				'on our record.',
				class: 'danger',
			});
			res.end(JSON.stringify({ redirect: '/login' }));
		}
		if (user) {
			// remove the existing password reset tokens
			Token.find({ email: email, tokenType: false }).remove(function (err) {
				if (err) {
					console.log(err);
				}

				var token = randtoken.generate(64);

				Token.create({ token: token, email: email }, function (err) {
					if (err) {
						req.flash('loginFlash', {
							text: 'Failed to generate an email reset token.',
							class: 'danger',
						});
						res.end(JSON.stringify({ redirect: '/login' }));
					}

					var sendFrom = 'Peace Corps <team@projectdelta.io>';
					var sendTo = email;
					var subject = 'Peace Corps BonVoyage Password Reset Request';
					var map = {
						name: user.name.split(' ')[0],
						button: 'http://localhost:3000/reset/' + token,
					};

					// asynchronous
					process.nextTick(function () {
						helpers.sendTemplateEmail(sendFrom, sendTo, subject,
						'password', map);
					});
				});
			});
		}
	});

	req.flash('loginFlash', {
		text: 'Instructions to reset your password have been ' +
			'sent to your email address.',
		class: 'success',
	});
	res.end(JSON.stringify({ redirect: '/login' }));
};

router.resetValidator = function (req, res) {
	var token = req.params.token;
	var newPassword = req.body.newPassword;
	var confirmPassword = req.body.confirmPassword;

	if (newPassword == confirmPassword) {
		// validate token
		// modify the password
		Token.findOneAndRemove({ token: token }, function (err, validToken) {
			if (err) {
				req.flash('loginFlash', {
					text: 'Invalid token. Please request to reset ' +
						'your password again.',
					class: 'danger',
				});
				res.end(JSON.stringify({ redirect: '/login' }));
			} else {
				// token has been found
				if (validToken) {
					var email = validToken.email;

					User.findOne({ email: email }, function (err, account) {
						if (err) {
							req.flash('loginFlash', {
								text: 'This account does not exist in our ' +
									'records anymore.',
								class: 'danger',
							});
							res.end(JSON.stringify({ redirect: '/login' }));
						} else {
							account.hash = newPassword;

							account.save(function (err) {
								if (err) {
									// couldn't save the user
									req.flash('loginFlash', {
										text: 'There has been an error ' +
											'resetting your password. ' +
											'Please retry.',
										class: 'danger',
									});
									res.end(JSON.stringify({ redirect: '/login' }));
								}

								req.flash('loginFlash', {
									text: 'Your password has been ' +
										'successfully updated.',
									class: 'success',
								});
								res.end(JSON.stringify({ redirect: '/login' }));
							});
						}
					});
				} else {
					req.flash('loginFlash', {
						text: 'Invalid token. Please request to reset your ' +
							'password again.',
						class: 'danger',
					});
					res.end(JSON.stringify({ redirect: '/login' }));
				}
			}
		});
	} else {
		req.flash('loginFlash', {
			text: 'New Password is different from Confirm Password. ' +
				'Please retry.',
			class: 'danger',
		});
		res.end(JSON.stringify({ redirect: '/login' }));
	}
};

router.logout = function (req, res) {
	req.logout();
	req.flash('loginFlash', {
		text: 'You have been logged out.',
		class: 'success',
	});
	res.end(JSON.stringify({ redirect: '/login' }));
};

router.modifyAccess = function (req, res) {
	var userId = req.body.userId;
	var access = req.body.access;
	if (access >= Access.VOLUNTEER &&
		access <= Access.ADMIN &&
		(req.user.access == Access.ADMIN ||
		access < req.user.access)) {
		User.update({
			_id: userId,
		}, {
			$set: {
				access: access,
			},
		}, function (err) {
			if (err) {
				console.error(err);
			} else {
				req.flash('usersFlash', {
					text: 'The user\'s access rights have been updated.',
					class: 'success',
				});
			}

			res.end(JSON.stringify({ redirect: '/users' }));
		});
	} else {
		res.end(JSON.stringify({ redirect: '/users' }));
	}
};

router.modifyProfile = function (req, res) {
	// Update the user object
	var userId = req.params.userId;
	if (userId === undefined) {
		userId = req.user._id;
	}

	console.log(userId);
	console.log(req.body);

	User.update({ _id: userId }, req.body.new, function (err) {
		if (err) {
			req.flash('profileFlash', {
				text: 'An occurred while attempting to update ' +
					(req.user._id == userId ? 'your' :
						req.body.new.name + '\'s') +
					' profile.',
			});
			console.error(err);
		}

		req.flash('profileFlash', {
			text: (req.user._id == userId ?
				'Your profile has been updated.' :
				(req.body.new.name || req.body.old.name) + '\'s profile has been updated.'),
			class: 'success',
		});
		res.redirect('/profile');
	});
};

function validateUsers(users, loggedInUser, cb) {
	User.find({}, 'email', function (err, results) {
		if (err) {
			cb(err);
		} else {
			var emails = results.map(function (elem) {return elem.email;});

			var newUsers = [];
			for (var i = 0; i < users.length; i++) {
				var user = users[i];
				var isNameValid = user.name.value && user.name.value !== '';
				var isEmailValid = user.email.value && user.email.value !== '' &&
					emails.indexOf(user.email.value) == -1;
				var countryValue = (user.countryCode.value &&
					user.countryCode.value !== '' ? user.countryCode.value :
					loggedInUser.country);
				var isCountryValid = countryValue && countryValue !== '' &&
					countriesDictionary[countryValue] !== undefined;
				var accessValue = (user.access.value && user.access.value !== '' ?
					user.access.value : Access.VOLUNTEER);
				var isAccessValid = (accessValue >= Access.VOLUNTEER &&
					accessValue <= Access.ADMIN && (accessValue < loggedInUser.access ||
					loggedInUser.access === Access.ADMIN));
				newUsers.push({
					name: {
						value: user.name.value,
						valid: isNameValid,
					},
					email: {
						value: user.email.value,
						valid: isEmailValid,
					},
					country: {
						value: (isCountryValid ? countriesDictionary[countryValue] : ''),
						valid: isCountryValid,
					},
					countryCode: {
						value: countryValue,
						valid: isCountryValid,
					},
					access: {
						value: accessValue,
						valid: isAccessValid,
					},
					valid: isNameValid && isEmailValid && isCountryValid && isAccessValid,
				});
				emails.push(user.email.value);
			}

			cb(null, newUsers);
		}
	});
}

router.postUsers = function (req, res) {
	// Now that we have converted the CSV to JSON, we need to validate it
	validateUsers(req.body, req.user, function (err, validatedUsers) {
		if (err) { throw err; }

		var allValid = validatedUsers.every(function (user) {
			return user && user.valid;
		});

		if (allValid) {
			// Add each of the users to the db
			validatedUsers.map(function (user) {

				// create registration token for each user, then send email

				var token = randtoken.generate(64);

				Token.create({ token: token, name: user.name.value,
					email: user.email.value.toLowerCase(),
					country: user.countryCode.value,
					tokenType: true, }, function (err) {
					if (err) {
						req.flash('addUsersFlash', {
							text: 'Some of the uploaded users are invalid. ' +
								'Please fix the issues in the table below before creating any users.',
							class: 'danger',
						});
						res.end(JSON.stringify({ redirect: '/users/add' }));
					}

					var sendFrom = 'Peace Corps <team@projectdelta.io>';
					var sendTo = user.email.value.toLowerCase();
					var subject = 'Peace Corps BonVoyage Registration';
					var map = {
						name: user.name.value.split(' ')[0],
						button: 'http://localhost:3000/register/' + token,
					};

					// asynchronous
					process.nextTick(function () {
						helpers.sendTemplateEmail(sendFrom, sendTo, subject,
						'register', map);
					});
				});
			});

			req.flash('usersFlash', {
				text: 'Registration invitation(s) have been sent to ' +
				validatedUsers.length + ' user(s).',
				class: 'success',
			});
			res.end(JSON.stringify({ redirect: '/users' }));
		} else {
			req.flash('addUsersFlash', {
				text: 'Some of the uploaded users are invalid. ' +
					'Please fix the issues in the table below before creating any users.',
				class: 'danger',
			});
			res.end(JSON.stringify({ redirect: '/users/add' }));
		}
	});
};

router.validateUsers = function (req, res) {
	var file = req.file;
	if (file !== undefined && file.path) {
		console.log(file);
		var converter = new Converter({
			noheader: true,
		});
		converter.fromFile(file.path, function (err, json) {
			if (err) {
				throw err;
			} else {
				console.log(json);
				var formattedJSON = [];
				for (var i = 0; i < json.length; i++) {
					formattedJSON.push({
						name: { value: json[i].field1 },
						email: { value: json[i].field2 },
						countryCode: { value: json[i].field3 },
						access: { value: json[i].field4 },
					});
				}

				// Now that we have converted the CSV to JSON, we need to validate it
				validateUsers(formattedJSON, req.user, function (err, newUsers) {
					if (err) { throw err; }

					res.end(JSON.stringify(newUsers));
				});
			}
		});
	} else {
		res.end(JSON.stringify(null));
	}
};

/*
 * DELETE Requests
 */
router.deleteUser = function (req, res) {
	var userId = req.body.userId;
	if (userId == req.user._id || req.user.access == Access.ADMIN) {
		Request.find({ userId: userId }).remove(function (err) {
			if (err) {
				console.error(err);
				req.flash('usersFlash', {
					text: 'An error has occurred while attempting to delete the user.',
					class: 'danger',
				});
				res.end(JSON.stringify({ redirect: '/users' }));
			} else {
				User.find({ _id: userId }).remove(function (err) {
					if (err) {
						console.error(err);
						req.flash('usersFlash', {
							text: 'An error has occurred while attempting to delete the user.',
							class: 'danger',
						});
					} else {
						req.flash('usersFlash', {
							text: 'The user has been deleted.',
							class: 'success',
						});
					}

					res.end(JSON.stringify({ redirect: '/users' }));
				});
			}
		});
	} else {
		res.status(401).send('Unauthorized');
	}
};

module.exports = router;
