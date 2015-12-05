var express = require('express');
var router = express.Router();
var User = require("../models/user");


router.renderLogin = function(req, res) {
	res.render('login.jade', {title: 'Login', message: req.flash('loginMessage')});
}

router.renderRegister = function(req, res) {
    res.render('register.jade', {title: 'Register', message: req.flash('signupMessage')});
}

router.renderVDash = function(req, res) {
	res.render('volunteer_dash.jade', {title: "Dash"});
}

module.exports = router;
