var express = require('express');
var router = express.Router();
var User = require("../models/user");


router.renderLogin = function(req, res) {
	res.render('login.jade', {title: 'Login'});
}

router.renderRegister = function(req, res) {
    res.render('register.jade', {title: 'Register'});
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
    		console.log(object.hash);
	    	if (object.hash == password) {
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
		hash: pass1
	});

	newUser.save(function(err) {
		if (err)
			console.log(err);
		else
			console.log("success");
	});

}

module.exports = router;
