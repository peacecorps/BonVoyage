var express = require('express');
var router = express.Router();
var User = require("../models/user");
var Request = require("../models/request");
var Access = require("../config/access");
var fs = require('fs');
var moment = require('moment');
var countries_dictionary = JSON.parse(fs.readFileSync("public/data/countryList.json", 'utf8'));

/* 
 * Helper Functions
 */
function getStartDate(request) {
	if (request.legs.length > 0) {
		start_date = request.legs[0].start_date;
		for (var i = 1; i < request.legs.length; i++) {
			if (request.legs[i].start_date instanceof Date) {
				if(request.legs[i].start_date < start_date)
					start_date = request.legs[i].start_date;	
			} else {
				if (request.legs[i].start_date.isBefore(start_date))
					start_date = request.legs[i].start_date;
			}
		}
		return start_date;
	} else {
		return undefined;
	}
}

function getEndDate(request) {
	if (request.legs.length > 0) {
		end_date = request.legs[0].end_date;
		for (var i = 1; i < request.legs.length; i++) {
			if (request.legs[i].end_date instanceof Date) {
				if(request.legs[i].end_date > end_date)
					end_date = request.legs[i].end_date;	
			} else {
				if (request.legs[i].end_date.isAfter(end_date))
					end_date = request.legs[i].end_date;
			}
		}
		return end_date;
	} else {
		return undefined;
	}
}

function getRequests(req, res, pending, cb) {
	if (req.user) {
		Request.aggregate([
			{
				// If access is supervisor or higher, match all requests: else only the user's requests
				$match: (req.user.access >= Access.SUPERVISOR ? {} : { email: req.user.email })
			},
			{
				// JOIN with the user data belonging to each request
				$lookup: {
					from: "users", 
					localField: "email", 
					foreignField: "email", 
					as: "user"
				}
			},
			{
				$match: (pending != undefined ? { is_pending: pending } : {})
			}
		], function (err, requests) {
			if (err) 
				return cb(err);
			else {
				// Add start and end date to all requests
				for (var i = 0; i < requests.length; i++) {
					requests[i].start_date = getStartDate(requests[i]);
					requests[i].end_date = getEndDate(requests[i]);
				}

				// console.log(requests);
				cb(null, requests);
			}
		});
	} else {
      	cb(null, []);
	}
}

function getUsers(options, cb) {
	var q = (options.user != undefined ? options.user : {});
	if (options.maxAccess != undefined) {
		q.access = {$lte: options.maxAccess};
	}
	User.find(q, 'access name email phone _id', function(err, users) {
		if (err) cb(err);
		else cb(null, users);
	});
}

/*
 * Handle Parameters
 */
router.handleRequestId = function(req, res, next, request_id) {
	// Look up request_id to determine if it is pending or not
	Request.findOne({ _id: request_id }, 'is_pending', function(err, request) {
		if (err) next(err);
		getRequests(req, res, request.is_pending, function(err, requests) {
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
	getRequests(req, res, undefined, function(err, requests) {
		if(err) console.error(err);
		res.send(requests);
	});
};

router.getPendingRequests = function(req, res) {
	getRequests(req, res, true, function(err, requests) {
		if(err) console.error(err);
		res.send(requests);
	});
};

router.getPastRequests = function(req, res) {
	getRequests(req, res, false, function(err, requests) {
		if(err) console.error(err);
		res.send(requests);
	});
};

router.getUsers = function(req, res) {
	var rawMaxAccess = req.query.maxAccess;
	var maxAccess = Access[rawMaxAccess];
	getUsers({
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
	getUsers({
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

router.logout = function(req, res) {
	req.logout();
	req.flash('loginFlash', { text: 'You have been logged out.', class: 'success'});
	res.end(JSON.stringify({redirect: '/login'}));
}

router.modifyAccess = function(req, res) {
	email = req.body.email;
	access = req.body.access;
	if (access <= req.user.access) {
		User.update({ email: email }, { $set: { access: access } }, function(err, numAffected) {
			if (err) console.error(err);
			else console.log(numAffected);
		});
	}
}

module.exports = router;

