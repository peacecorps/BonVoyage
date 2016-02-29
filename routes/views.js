/* jshint node: true */
'use strict';

var express = require('express');
var router = express.Router();
var Access = require('../config/access');
var fs = require('fs');
var helpers = require('./helpers');
var warnings;

router.index = function (req, res) {
	res.redirect('/login');
};

router.renderLogin = function (req, res) {
	var sub = {};
	if (req.session.submission) {
		sub = req.session.submission;
		req.session.submission = null;
	}

	res.render('login.jade', {
		title: 'Login',
		messages: req.flash('loginFlash'),
		links: [
			{ text: 'Login', href: '/login', active: true },
			{ text: 'Register', href: '/register' },
		],
		hideLogout: true,
		submission: sub,
	});
};

router.renderRegister = function (req, res) {
	var sub = {};
	if (req.session.submission) {
		sub = req.session.submission;
		req.session.submission = null;
	}

	res.render('register.jade', {
		title: 'Register',
		messages: req.flash('registerFlash'),
		links: [
			{ text: 'Login', href: '/login' },
			{ text: 'Register', href: '/register', active: true },
		],
		hideLogout: true,
		submission: sub,
	});
};

router.renderReset = function (req, res) {
	res.render('forgot_password.jade', {
		title: 'Forgot Password',
		messages: req.flash('resetFlash'),
		links: [
			{ text: 'Login', href: '/login' },
			{ text: 'Register', href: '/register', active: true },
		],
		hideLogout: true,
	});
};

/* incomplete */
router.renderValidReset = function (req, res) {
	res.render('reset.jade', {
		title: 'Password Reset',
		messages: req.flash('resetFlash'),
		links: [
			{ text: 'Login', href: '/login' },
			{ text: 'Register', href: '/register', active: true },
		],
		hideLogout: true,
	});
};

router.renderSubform = function (req, res) {
	var sub = {};
	if (req.session.submission) {
		sub = req.session.submission;
		req.session.submission = null;
	}

	var links = [
		{ text: 'Dashboard', href: '/dashboard' },
		{ text: 'Submit a Request', href: '/dashboard/submit', active: true },
	];
	if (req.user.access >= Access.SUPERVISOR) {
		links.push({ text: 'Users', href: '/users' });
		links.push({ text: 'Add Users', href: '/users/add' });
	}

	res.render('submissionForm.jade', {
		title: 'Submission Form',
		links: links,
		messages: req.flash('submissionFlash'),
		shouldSelectRequestee: req.user.access >= Access.SUPERVISOR,
		submission: sub,
	});
};

router.renderApproval = function (req, res) {
	if (!warnings) {
		warnings = JSON.parse(fs.readFileSync('public/data/warnings.json', 'utf8'));
	}

	// Merge warnings to requests
	for (var i = 0; i < req.request.legs.length; i++) {
		req.request.legs[i].warnings = warnings[req.request.legs[i].countryCode];
	}

	if (req.request.status.isPending === false) {
		var flash = {};
		if (req.request.status.isApproved === false) {
			flash = {
				text: 'This request has been denied.',
				class: 'danger',
			};
		} else {
			flash = {
				text: 'This request has been approved.',
				class: 'success',
			};
		}

		req.flash('approvalFlash', flash);
	} else {
		var pendingFlash = {
			text: 'This request is currently pending.',
			class: 'warning',
		};
		req.flash('approvalFlash', pendingFlash);
	}

	var links = [
		{ text: 'Dashboard', href: '/dashboard' },
		{ text: 'Submit a Request', href: '/dashboard/submit' },
	];
	if (req.user.access >= Access.SUPERVISOR) {
		links.push({ text: 'Users', href: '/users' });
		links.push({ text: 'Add Users', href: '/users/add' });
	}

	res.render('approval.jade', {
		title: 'Request Approval',
		links: links,
		messages: req.flash('approvalFlash'),
		request: req.request,
		nextRequestId: req.nextRequestId,
		prevRequestId: req.prevRequestId,
	});
};

router.renderDashboard = function (req, res) {
	var links = [
		{ text: 'Dashboard', href: '/dashboard', active: true },
		{ text: 'Submit a Request', href: '/dashboard/submit' },
	];
	if (req.user.access >= Access.SUPERVISOR) {
		links.push({ text: 'Users', href: '/users' });
		links.push({ text: 'Add Users', href: '/users/add' });
	}

	res.render('dashboard.jade', {
		title: 'Dashboard',
		links: links,
		messages: req.flash('dashboardFlash'),
	});
};

router.renderUsers = function (req, res) {
	if (req.user.access >= Access.SUPERVISOR) {
		helpers.getUsers({
			maxAccess: req.user.access,
		}, function (err, users) {
			if (err) {
				console.error(err);
			}

			// Split users based on their access level
			var admins = [];
			var supervisors = [];
			var volunteers = [];
			for (var i = 0; i < users.length; i++) {
				var user = users[i];
				switch (user.access) {
					case Access.ADMIN:
						admins.push(user);
						break;
					case Access.SUPERVISOR:
						supervisors.push(user);
						break;
					case Access.VOLUNTEER:
						volunteers.push(user);
						break;
				}
			}

			res.render('users.jade', {
				title: 'Users',
				links: [
					{ text: 'Dashboard', href: '/dashboard' },
					{ text: 'Submit a Request', href: '/dashboard/submit' },
					{ text: 'Users', href: '/users', active: true },
					{ text: 'Add Users', href: '/users/add' },
				],
				messages: req.flash('usersFlash'),
				admins: admins,
				supervisors: supervisors,
				volunteers: volunteers,
			});
		});
	} else {
		req.flash({ text: 'You do not have access to this page.', class: 'danger' });
		res.redirect('/dashboard');
	}
};

router.renderProfile = function (req, res) {
	var userId = req.params.userId;

	if (userId === undefined) {
		userId = req.user._id;
	}

	// Verify that the user has the right access to view this profile
	if ((req.user.access == Access.VOLUNTEER &&
		req.user._id == userId) ||
		(req.user.access > Access.VOLUNTEER)) {
		helpers.getUsers({ user: { _id: userId } }, function (err, users) {
			if (err) {
				console.error(err);
			} else {
				if (users.length > 0) {
					var user = users[0];
					var navLinks = [
						{ text: 'Dashboard', href: '/dashboard' },
						{ text: 'Submit a Request', href: '/dashboard/submit' },
					];
					if (req.user.access > Access.VOLUNTEER) {
						navLinks.push({ text: 'Users', href: '/users' });
						navLinks.push({ text: 'Add Users', href: '/users/add' });
					}

					res.render('profile.jade', {
						title: 'Profile',
						links: navLinks,
						messages: req.flash('profileFlash'),
						userToShow: user,
					});
				} else {
					req.flash('dashboardFlash', {
						text: 'The profile for the requested user could not be found.',
						class: 'danger',
					});
					res.redirect('/dashboard');
				}
			}
		});
	} else {
		req.flash('dashboardFlash', {
			text: 'You do not have access to view this profile.',
			class: 'danger',
		});
		res.redirect('/dashboard');
	}
};

router.renderAddUsers = function (req, res) {
	if (req.user.access >= Access.SUPERVISOR) {
		var links = [
			{ text: 'Dashboard', href: '/dashboard' },
			{ text: 'Submit a Request', href: '/dashboard/submit' },
			{ text: 'Users', href: '/users' },
			{ text: 'Add Users', href: '/users/add', active: true },
		];

		res.render('addUsers.jade', {
			title: 'Add Users',
			links: links,
			messages: req.flash('addUsersFlash'),
		});
	} else {
		req.flash({ text: 'You do not have access to this page.', class: 'danger' });
		res.redirect('/dashboard');
	}
};

module.exports = router;
