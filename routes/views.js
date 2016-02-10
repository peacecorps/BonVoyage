var express = require('express');
var router = express.Router();
var User = require("../models/user");
var Request = require("../models/request");
var Access = require("../config/access");
var fs = require('fs');
var helpers = require('./helpers');
var warnings = undefined;

router.index = function(req, res, next) {
	res.redirect('/login');
};

router.renderLogin = function(req, res) {
	var sub = {};
	if (req.session.submission) {
		sub = req.session.submission;
		req.session.submission = null;
	}
	res.render('login.jade', {
		title: 'Login', 
		messages: req.flash('loginFlash'), 
		links: [
			{ text: "Login", href: "/login", active: true },
			{ text: "Register", href: "/register" }
		],
		hideLogout: true,
		submission: sub
	});
}

router.renderRegister = function(req, res) {
	var sub = {};
	if (req.session.submission) {
		sub = req.session.submission;
		req.session.submission = null;
	}
    res.render('register.jade', {
    	title: 'Register', 
    	messages: req.flash('registerFlash'), 
		links: [
			{ text: "Login", href: "/login" },
			{ text: "Register", href: "/register", active: true }
		],
		hideLogout: true,
		submission: sub
	});
}

router.renderSubform = function(req, res) {
	var links = [
		{ text: "Dashboard", href: "/dashboard" },
		{ text: "Submit a Request", href: "/dashboard/submit", active: true }
	];
	if (req.user.access >= Access.SUPERVISOR) 
		links.push({ text: "Users", href: "/users" });
    res.render('submission_form.jade', {
    	title: 'Submission Form',
    	links: links,
    	messages: req.flash('submissionFlash'),
    	shouldSelectRequestee: req.user.access >= Access.SUPERVISOR
    });
}

router.renderApproval = function(req, res) {
	if (!warnings)
		warnings = JSON.parse(fs.readFileSync("public/data/warnings.json", 'utf8'));
	// Merge warnings to requests
	for(var i = 0; i < req.request.legs.length; i++) {
		req.request.legs[i].warnings = warnings[req.request.legs[i].country_code];
	}
	if (req.request.is_pending == false) {
		var deniedFlash = { 
			text: 'This request has been denied.', 
			class: 'danger' 
		};
		var approvedFlash = { 
			text: 'This request has been approved.', 
			class: 'success' 
		};
		req.flash('approvalFlash', (req.request.is_approved ? approvedFlash : deniedFlash));
	}
	var links = [
		{ text: "Dashboard", href: "/dashboard" },
		{ text: "Submit a Request", href: "/dashboard/submit" }
	];
	if (req.user.access >= Access.SUPERVISOR) 
		links.push({ text: "Users", href: "/users" });
	res.render('approval.jade', {
		title: 'Request Approval',
		links: links,
		messages: req.flash('approvalFlash'),
		request: req.request,
		next_request_id: req.next_request_id,
		prev_request_id: req.prev_request_id
	});
}

router.renderDashboard = function(req, res) {
	var links = [
		{ text: "Dashboard", href: "/dashboard", active: true },
		{ text: "Submit a Request", href: "/dashboard/submit" }
	];
	if (req.user.access >= Access.SUPERVISOR) 
		links.push({ text: "Users", href: "/users" });
	res.render('dashboard.jade', {
		title: "Dashboard",
		links: links,
		messages: req.flash('dashboardFlash')
	});
}

router.renderUsers = function(req, res) {
	if (req.user.access >= Access.SUPERVISOR) {
		helpers.getUsers({
			maxAccess: req.user.access
		}, function(err, users) {
			if (err) console.error(err);

			// Split users based on their access level
			admins = [];
			supervisors = [];
			volunteers = [];
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
			};

		    res.render('users.jade', {
		    	title: 'Users',
		    	links: [
					{ text: "Dashboard", href: "/dashboard" },
					{ text: "Submit a Request", href: "/dashboard/submit" },
					{ text: "Users", href: "/users", active: true }
		    	],
		    	messages: req.flash('usersFlash'),
		    	admins: admins,
		    	supervisors: supervisors,
		    	volunteers: volunteers
		    });
		});
	} else {
		res.redirect('/dashboard');
	}
}

module.exports = router;

