var express = require('express');
var router = express.Router();
var User = require("../models/user");
var Request = require("../models/request");
var Token = require("../models/token");
var Access = require("../config/access");
var fs = require('fs');
var moment = require('moment');
var randtoken = require('rand-token');
var api_key = require('../config/email');
var uri = require('../config/domain');
var mailgun = require('mailgun-js')({apiKey: api_key, domain: uri});
var countries_dictionary = JSON.parse(fs.readFileSync("public/data/countryList.json", 'utf8'));
var helpers = require('./helpers');

/*
 * Handle Parameters
 */
router.handleRequestId = function(req, res, next, request_id) {
	// Look up request_id to determine if it is pending or not
	Request.findOne({ _id: request_id }, 'is_pending', function(err, request) {
		if (err) next(err);
		helpers.getRequests(req, res, request.is_pending, function(err, requests) {
			if (err) next(err);
			else {
				// Lookup the id in this list of requests
				for(var i = 0; i < requests.length; i++) {
					if(requests[i]._id == request_id) {
						req.request = requests[i];
						req.next_request_id = (i < requests.length - 1 ? requests[i+1]._id : undefined);
						req.prev_request_id = (i > 0 ? requests[i-1]._id : undefined);
						next();
					}
				}
				if (req.request == undefined)
					next();
			}
		});
	});
}

/*
 * GET Requests
 */

router.getRequests = function(req, res) {
	helpers.getRequests(req, res, undefined, function(err, requests) {
		if(err) console.error(err);
		res.send(requests);
	});
};

router.getPendingRequests = function(req, res) {
	helpers.getRequests(req, res, true, function(err, requests) {
		if(err) console.error(err);
		res.send(requests);
	});
};

router.getPastRequests = function(req, res) {
	helpers.getRequests(req, res, false, function(err, requests) {
		if(err) console.error(err);
		res.send(requests);
	});
};

router.getUsers = function(req, res) {
	var rawMaxAccess = req.query.maxAccess;
	var maxAccess = Access[rawMaxAccess];
	helpers.getUsers({
		maxAccess: maxAccess,
	}, function(err, users) {
		if(err) console.error(err);
		res.send(users);
	});
}

/*
 * POST Requests
 */

router.postRequests = function(req, res) {
	var email = req.user.email;
	// Supervisors will select the user to submit the request for on the submission form
	if (req.user.access >= Access.SUPERVISOR) {
		email = req.body.email;
		if (email == undefined) {
			req.flash('submissionFlash', { text: 'You must select a requestee to submit this request for.', class: 'danger' });
			res.end(JSON.stringify({redirect: '/dashboard/submit'}));
			return;
		}
	}
	// Verify that the user exists
	helpers.getUsers({
		user: {
			email: email
		}
	}, function(err, users) {
		if(users.length > 0) {
			var legs = [];
			for (var i = 0; i < req.body.legs.length; i++) {
				leg = req.body.legs[i];
				var start = moment(leg.start_date);
				var end = moment(leg.end_date);
				if (!(start.isBefore(end) || start.isSame(end))) {
					req.flash('submissionFlash', { text: 'The start date you entered for leg #' + (i+1) + ' comes after the end date.', class: 'danger' });
					res.end(JSON.stringify({redirect: '/dashboard/submit'}));
					return;
				} else if (Object.keys(countries_dictionary).indexOf(leg.country) == -1) {
					req.flash('submissionFlash', { text: 'The country that you have selected for leg #' + (i+1) + ' is not a valid country.', class: 'danger' });
					res.end(JSON.stringify({redirect: '/dashboard/submit'}));
					return;
				}

				legs.push({
					start_date: start,
					end_date: end,
					country: countries_dictionary[leg.country],
					country_code: leg.country,
					hotel: leg.hotel,
					contact: leg.contact,
					companions: leg.companions,
					description: leg.description
				});
			}

			if (legs.length > 0) {
				var newRequest = new Request({
					email: email,
					is_pending: true,
					is_approved: false,
					legs: legs
				});

				newRequest.save(function(err) {
					if (err) {
						req.flash('submissionFlash', { text: 'An error has occurred while trying to save this request. Please try again.', class: 'danger' });
						res.end(JSON.stringify({redirect: '/dashboard/submit'}));
					} else {
						req.flash('dashboardFlash', { text: 'Request successfully saved.', class: 'success' });
						res.end(JSON.stringify({redirect: '/dashboard'}));
					}
				});
			} else {
				req.flash('submissionFlash', { text: 'An error has occurred while trying to save this request. Please try again.', class: 'danger' });
				res.end(JSON.stringify({redirect: '/dashboard/submit'}));
			}
		} else {
			req.flash('submissionFlash', { text: 'The user that you selected could not be found.', class: 'danger' });
			res.end(JSON.stringify({redirect: '/dashboard/submit'}));
			return;
		}
	});
}

router.postApprove = function(req, res) {
	var id = req.params.request_id;
	Request.findByIdAndUpdate(id, {$set:{"is_pending":false, "is_approved":true}}, function(err, doc) {
		if (err) return res.send(500, {error: err});
		req.flash('dashboardFlash', { text: 'The request has been successfully approved.', class: 'success'});
		res.end(JSON.stringify({redirect: '/dashboard'}));
	});
}

router.postDeny = function(req, res) {
	var id = req.params.request_id;
	Request.findByIdAndUpdate(id, {$set:{"is_pending":false, "is_approved":false}}, function(err, doc) {
		if (err) return res.send(500, {error: err});
		req.flash('dashboardFlash', { text: 'The request has been successfully denied.', class: 'success'});
		res.end(JSON.stringify({redirect: '/dashboard'}));
	});
}

router.postDelete = function(req, res) {
	var id = req.params.request_id;
	Request.findOneAndRemove({'_id':id, email: req.user.email}, function(err, doc) {
		if (err) return res.send(500, {error: err});
		req.flash('dashboardFlash', { text: 'The request has been successfully deleted.', class: 'success'});
		res.end(JSON.stringify({redirect: '/dashboard'}));
	});
}

router.postComments = function(req, res) {
	var id = req.params.request_id;
	Request.findByIdAndUpdate(id, {$push: {
		comments: {
			$each:[{
				name:req.user.name,
				email:req.user.email,
				content:req.param('content')
			}]
		}
	}}, function(err, doc) {
		if (err) return res.send(500, {error: err});
		req.flash('approvalFlash', { text: 'Your comment has been added.', class: 'success' });
		res.end(JSON.stringify({redirect: '/dashboard/requests/' + id}));
	});
}

router.reset = function(req, res) {
	var email = req.body.email;

	// first check if email is registered

	User.findOne({ email: email }, function(err, doc) {
		if (doc) {
			var token = randtoken.generate(16);
			Token.create({token: token, email: email}, function(err, doc) {
			    if (err) {
					req.flash('loginFlash', { text: 'Failed to generate an email reset token.', class: 'success'});
					res.end(JSON.stringify({redirect: '/login'}));
					done();
			    }


			    // send email


			});
		}
	});


	req.flash('loginFlash', { text: 'Instructions to reset your password have been sent to your email address.', class: 'success'});
	res.end(JSON.stringify({redirect: '/login'}));

}

router.logout = function(req, res) {
	req.logout();
	req.flash('loginFlash', { text: 'You have been logged out.', class: 'success'});
	res.end(JSON.stringify({redirect: '/login'}));
}

router.modifyAccess = function(req, res) {
	email = req.body.email;
	access = req.body.access;
	if (access >= Access.VOLUNTEER && access <= Access.ADMIN && (req.user.access == Access.ADMIN || access < req.user.access)) {
		User.update({ email: email }, { $set: { access: access } }, function(err, numAffected) {
			if (err) console.error(err);
			else req.flash('usersFlash', { text: 'The user\'s access rights have been updated.' , class: 'success'});
			res.end(JSON.stringify({redirect: '/users'}));
		});
	} else {
		res.end(JSON.stringify({redirect: '/users'}));
	}
}

/*
 * DELETE Requests
 */

router.deleteUser = function(req, res) {
	email = req.body.email;
	console.log(email);
	User.find({ email: email }).remove(function(err, numAffected) {
		if (err) console.error(err);
		else req.flash('usersFlash', { text: 'The user has been deleted.' , class: 'success'});
		res.end(JSON.stringify({redirect: '/users'}));
	});
}

module.exports = router;

