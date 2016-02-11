var User = require("../models/user");
var Request = require("../models/request");
var Access = require("../config/access");
var api_key = require('../config/email');
var uri = require('../config/domain');
var mailgun = require('mailgun-js')({apiKey: api_key, domain: uri});

/* 
 * Helper Functions
 */
module.exports.getStartDate = function(request) {
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

module.exports.getEndDate = function(request) {
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

module.exports.getRequests = function(req, res, pending, cb) {
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
					requests[i].start_date = module.exports.getStartDate(requests[i]);
					requests[i].end_date = module.exports.getEndDate(requests[i]);
				}

				// console.log(requests);
				cb(null, requests);
			}
		});
	} else {
      	cb(null, []);
	}
}

module.exports.getUsers = function(options, cb) {
	var q = (options.user != undefined ? options.user : {});
	if (options.maxAccess != undefined) {
		q.access = {$lte: options.maxAccess};
	}
	User.find(q, 'access name email phone _id', function(err, users) {
		if (err) cb(err);
		else cb(null, users);
	});
}

module.exports.sendEmail = function(sendFrom, sendTo, subject, text, callback) {
	var data = {
		from: sendFrom,
		to: sendTo,
		subject: subject,
		text: text
	};

	mailgun.messages().send(data, function(err, body) {
		console.log(body);

		if (callback) {
			callback();
		}
	});
}




