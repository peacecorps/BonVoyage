var express = require('express');
var router = express.Router();
var User = require("../models/user");
var Request = require("../models/request");
var Access = require("../config/access");
var validator = require('validator');
var fs = require('fs');
var moment = require('moment');
var countries_dictionary = JSON.parse(fs.readFileSync("public/data/countryList.json", 'utf8'));

router.renderLogin = function(req, res) {
	res.render('login.jade', {
		title: 'Login', 
		message: req.flash('loginMessage'), 
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
    	message: req.flash('signupMessage'), 
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
    	message: req.flash('submissionFlash')
    });
}

router.postRequests = function(req, res) {

	var legs = [];
	for (var i = 0; i < req.body.legs.length; i++) {
		leg = req.body.legs[i];
		console.log(leg.start_date);
		console.log(leg.end_date);
		var start = moment(leg.start_date);
		var end = moment(leg.end_date);
		console.log(start);
		console.log(end);
		if (!(start.isBefore(end) || start.isSame(end))) {
			req.flash('submissionFlash', 'The start date you entered for leg #' + (i+1) + ' comes after the end date.');
			res.send({redirect: '/dashboard/submit'});
		} else if (Object.keys(countries_dictionary).indexOf(leg.country) == -1) {
			req.flash('submissionFlash', 'The country that you have selected for leg #' + (i+1) + ' is not a valid country.');
			res.send({redirect: '/dashboard/submit'});
		}

		legs.push({
			start_date: start,
			end_date: end,
			country: countries_dictionary[leg.cc],
			description: leg.description
		});
	}

	var newRequest = new Request({
		email: req.user.email,
		is_pending: true,
		is_approved: false,
		legs: legs
	});

	newRequest.save(function(err) {
		if (err) {
			req.flash('submissionFlash', 'An error has occurred while trying to save this request. Please try again.');
			res.send({redirect: '/dashboard/submit'});
		} else {
			req.flash('dashboardFlash', 'Request successfully saved.');
			res.send({redirect: '/dashboard'});
		}
	});
}

router.renderDashboard = function(req, res) {
	res.render('dashboard.jade', {
		title: "Dashboard",
		links: [
			{ text: "Dashboard", href: "/dashboard", active: true },
			{ text: "Submit a Request", href: "/dashboard/submit" }
		],
		message: req.flash('dashboardFlash')
	});
}


router.getRequests = function(req, res){
	if (req.user && req.user.access === Access.ADMIN) {
		Request.find(function (err, requests) {
		  if (err) return console.error(err);
		  res.json(requests);
		});

	} else if (req.user && req.user.access === Access.SUPERVISOR) {

		Request.find(function (err, requests) {
		  if (err) return console.error(err);
		  res.json(requests);
		});

	} else if (req.user && req.user.access === Access.VOLUNTEER) {
		Request.find({email: req.user.email}, function (err, requests) {
		  if (err) return console.error(err);
		  res.json(requests);
		});
	} else
      	res.send(401, 'Unauthorized');
};

router.getPastRequests = function(req, res){
	past_requests = [];
	res.json(past_requests); // TODO: Albert + Ben
};

router.promote = function(req, res) {
	email = req.body.email;
	access = req.body.access;
	User.update({ email: email }, { $set: { access: access } }, function(err, numAffected) {
		if (err) console.log(err);
		else console.log(numAffected);
	});
}

module.exports = router;

