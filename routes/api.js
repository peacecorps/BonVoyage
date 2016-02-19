/* jshint node: true */
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
			}

			if (legs.length > 0) {
				var newRequest = new Request({
					userId: userId,
					status: {
						isPending: true,
						isd: false,
					},
					legs: legs,
				});

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

		User.find({ _id: doc.userId }, function (err, user) {
			var sendFrom = 'Peace Corps <team@projectdelta.io>';
			var sendTo = user.email;
			var subject = 'Peace Corps BonVoyage Request Approved';
			var map = {
				name: req.user.name.split(' ')[0],
				button: 'http://localhost:3000',
			};

			helpers.sendTemplateEmail(sendFrom, sendTo, subject,
				'approve', map);

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

		User.find({ _id: doc.userId }, function (err, user) {
			var sendFrom = 'Peace Corps <team@projectdelta.io>';
			var sendTo = user.email;
			var subject = 'Peace Corps BonVoyage Request Denied';
			var map = {
				name: req.user.name.split(' ')[0],
				button: 'http://localhost:3000',
			};

			helpers.sendTemplateEmail(sendFrom, sendTo, subject,
				'deny', map);

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
		} else {
			// TODO: existing token must be removed
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

				helpers.sendTemplateEmail(sendFrom, sendTo, subject,
					'password', map);
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

/*
 * DELETE Requests
 */
router.deleteUser = function (req, res) {
	var userId = req.body.userId;
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
};

module.exports = router;
