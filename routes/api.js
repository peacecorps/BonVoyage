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

function getRequests(req, res, cb) {
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

				console.log(requests);
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
	
	getRequests(req, res, function(err, requests) {
		if (err) next(err);
		else {
			// Lookup the id in this list of requests
			for(var i = 0; i < requests.length; i++) {
				if(requests[i]._id == request_id) {
					req.request = requests[i];
					req.next_request_id = (i < requests.length - 1 ? requests[i+1]._id : undefined);
					req.prev_request_id = (i > 0 ? requests[i-1]._id : undefined);
					console.log("Approval Data");
					console.log(req.request);
					console.log(req.next_request_id);
					console.log(req.prev_request_id);
					next();
				}
			}
			if (req.request == undefined)
				next();
		}
	});
}

/*
 * GET Requests
 */

router.getRequests = function(req, res) {
	getRequests(req, res, function(err, requests) {
		if(err) console.error(err);
		res.send(requests);
	});
};

router.getPastRequests = function(req, res){
	past_requests = [];
	res.json(past_requests); // TODO: Albert + Ben
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
			req.flash('submissionFlash', 'The start date you entered for leg #' + (i+1) + ' comes after the end date.');
			res.end(JSON.stringify({redirect: '/dashboard/submit'}));
			return;
		} else if (Object.keys(countries_dictionary).indexOf(leg.country) == -1) {
			req.flash('submissionFlash', 'The country that you have selected for leg #' + (i+1) + ' is not a valid country.');
			res.end(JSON.stringify({redirect: '/dashboard/submit'}));
			return;
		}

		legs.push({
			start_date: start,
			end_date: end,
			country: countries_dictionary[leg.country],
			description: leg.description
		});
	}

	console.log(legs);

	if (legs.length > 0) {
		var newRequest = new Request({
			email: req.user.email,
			is_pending: true,
			is_approved: false,
			legs: legs
		});

		newRequest.save(function(err) {
			if (err) {
				req.flash('submissionFlash', 'An error has occurred while trying to save this request. Please try again.');
				res.end(JSON.stringify({redirect: '/dashboard/submit'}));
			} else {
				req.flash('dashboardFlash', 'Request successfully saved.');
				res.end(JSON.stringify({redirect: '/dashboard'}));
			}
		});
	} else {
		req.flash('submissionFlash', 'An error has occurred while trying to save this request. Please try again.');
		res.end(JSON.stringify({redirect: '/dashboard/submit'}));
	}
}

router.logout = function(req, res) {
	req.logout();
	res.redirect('/login');
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

