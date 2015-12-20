var express = require('express');
var router = express.Router();
var User = require("../models/user");
var Request = require("../models/request");


router.renderLogin = function(req, res) {
	res.render('login.jade', {title: 'Login', message: req.flash('loginMessage')});
}

router.renderRegister = function(req, res) {
    res.render('register.jade', {title: 'Register', message: req.flash('signupMessage')});
}

router.renderSubform = function(req, res) {
    res.render('submission_form.jade', {title: 'Submission Form'});
}

router.postLogin = function(req, res) {
    console.log("reach the server");
    var resp = {};

    var email = req.body.userEmail;
    var password = req.body.password;

    console.log(password);

    User.findOne({ email: email}, function(err, object) {
    	if (object) {
    		console.log("find email");
    		//console.log(object.hash);
	    	if (object.password == password) {
	    		resp.success = true;
	    	} else {
	    		resp.success = false;
	    	}
    	} else {
    		console.log("invalid email");
    		resp.success = false;
    	}
    	// Return the resp object
 		res.send(resp);
    })


}

router.postRegister = function(req, res) {

	var name = req.body.name;
	var email = req.body.email;
	var pass1 = req.body.pass1;
	var pass2 = req.body.pass2;

	var newUser = new User({
		name: name,
		email: email,
		password: pass1
	});

	newUser.save(function(err) {
		if (err)
			console.log(err);
		else
			console.log("success");
	});
}

router.postRequests = function(req, res) {
	var d1 = req.body.leaving;
	var d2 = req.body.returning;
	var country = req.body.country;
	var description = req.body.reason;


	var newRequest = new Request({

		email: req.user.email,
		start_date: d1,
		end_date: d2,
		country: country,
		is_pending: true,
		is_approved: false,
		description: description

	});

	newRequest.save(function(err) {
		if (err)
			console.log(err);
		else
			console.log("success");
	});
}

router.renderVDash = function(req, res) {
	res.render('volunteer_dash.jade', {title: "Dash"});
}


router.getRequests = function(req, res){
	if (req.user && req.user.group === "bonvoyage") {
		Request.find(function (err, requests) {
		  if (err) return console.error(err);
		  res.json(requests);
		});

	} else if (req.user && req.user.group === "supervisor") {

		Request.find(function (err, requests) {
		  if (err) return console.error(err);
		  res.json(requests);
		});

	} else if (req.user && req.user.group === "volunteer") {
		Request.find({email: req.user.email}, function (err, requests) {
		  if (err) return console.error(err);
		  res.json(requests);
		});


	} else
      	res.send(401, 'Unauthorized');

};

module.exports = router;

