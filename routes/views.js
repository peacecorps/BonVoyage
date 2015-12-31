var express = require('express');
var router = express.Router();
var User = require("../models/user");
var Request = require("../models/request");
var Access = require("../config/access");

router.index = function(req, res, next) {
  res.redirect('/login');
};

router.renderLogin = function(req, res) {
	res.render('login.jade', {
		title: 'Login', 
		messages: req.flash('loginFlash'), 
		links: [
			{ text: "Login", href: "/login", active: true },
			{ text: "Register", href: "/register" }
		],
		hideLogout: true
	});
}

router.renderRegister = function(req, res) {
    res.render('register.jade', {
    	title: 'Register', 
    	messages: req.flash('registerFlash'), 
		links: [
			{ text: "Login", href: "/login" },
			{ text: "Register", href: "/register", active: true }
		],
		hideLogout: true
	});
}

router.renderSubform = function(req, res) {
    res.render('submission_form.jade', {
    	title: 'Submission Form',
    	links: [
			{ text: "Dashboard", href: "/dashboard" },
			{ text: "Submit a Request", href: "/dashboard/submit", active: true }
    	],
    	messages: req.flash('submissionFlash')
    });
}

router.renderApproval = function(req, res) {
	var f = req.flash('approvalFlash');
	console.log(f);
	res.render('approval.jade', {
		title: 'Request Approval',
		links: [
			{ text: "Dashboard", href: "/dashboard" },
			{ text: "Submit a Request", href: "/dashboard/submit" }
		],
		messages: f,
		request: req.request,
		next_request_id: req.next_request_id,
		prev_request_id: req.prev_request_id
	});
}

router.renderDashboard = function(req, res) {
	res.render('dashboard.jade', {
		title: "Dashboard",
		links: [
			{ text: "Dashboard", href: "/dashboard", active: true },
			{ text: "Submit a Request", href: "/dashboard/submit" }
		],
		messages: req.flash('dashboardFlash')
	});
}

module.exports = router;

