var express = require('express');
var router = express.Router();
var sUser = require("../models/user");
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

/*
 * Handle Parameters
 */
router.handleRequestId = function(req, res, next, request_id) {
	// Look up request_id to determine if it is pending or not
	Request.findOne({ _id: request_id }, 'is_pending', function(err, request) {
		if (err) next(err);
		console.log("Returned from handle request id")
		console.log(request);
		console.log(request.is_pending);
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

router.getPastRequests = function(req, res){
	getRequests(req, res, false, function(err, requests) {
		if(err) console.error(err);
		res.send(requests);
	});
};

/*
 * POST Requests
 */

router.postRequests = function(req, res) {
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
			email: req.user.email,
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

/*
 * PUT Requests
 */

router.promote = function(req, res) {
	email = req.body.email;
	access = req.body.access;
	User.update({ email: email }, { $set: { access: access } }, function(err, numAffected) {
		if (err) console.log(err);
		else console.log(numAffected);
	});
}

module.exports = router;

