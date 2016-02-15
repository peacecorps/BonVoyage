var User = require("../models/user");
var Request = require("../models/request");
var Access = require("../config/access");
var DateOnly = require('dateonly');

// Attempt to load credentials for email and SMS
var dropEmail = false;
var dropSMS = false;

try {
	var credentials = require('../config/credentials');
} catch(exc) {
	console.error("Credentials file not found. (../config/credentials). Email and SMS will be dropped silently.");
	dropEmail = true;
	dropSMS = true;
}

try {
	var domain = require('../config/domain');
} catch(exc) {
	console.error("Domain file not found. (../config/domain). Email will be dropped silently.");
	dropEmail = true;
}

if (credentials && credentials.mailgun && domain) {
	var mailgunAPIKey = credentials.mailgun;
	var mailgun = require('mailgun-js')({apiKey: mailgunAPIKey, domain: domain});
} else dropEmail = true;

if (credentials && credentials.twilio) {
	var twilio = require('twilio');
	var twilioCfg = credentials.twilio;
	var twilioClient = new twilio.RestClient(twilioCfg.account_sid, twilioCfg.auth_token);
} else dropSMS = true;


/* 
 * Helper Functions
 */
module.exports.getStartDate = function(request) {
	if (request.legs.length > 0) {
		start_date = new DateOnly(request.legs[0].start_date);
		for (var i = 1; i < request.legs.length; i++) {
			var d = new DateOnly(request.legs[i].start_date)
			if(d < start_date)
				start_date = d;
		}
		return start_date;
	} else {
		return undefined;
	}
};

module.exports.getEndDate = function(request) {
	if (request.legs.length > 0) {
		end_date = new DateOnly(request.legs[0].end_date);
		for (var i = 1; i < request.legs.length; i++) {
			var d = new DateOnly(request.legs[i].end_date)
			if(d > end_date)
				end_date = d;
		}
		return end_date;
	} else {
		return undefined;
	}
};

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
				$match: (pending != undefined ? {'status.is_pending': pending } : {})
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
};

module.exports.getUsers = function(options, cb) {
	var q = (options.user != undefined ? options.user : {});
	if (options.maxAccess != undefined) {
		q.access = {$lte: options.maxAccess};
	}
	User.find(q, 'access name email phone _id', function(err, users) {
		if (err) cb(err);
		else cb(null, users);
	});
};

module.exports.sendEmail = function(sendFrom, sendTo, subject, text, callback) {
	var data = {
		from: sendFrom,
		to: sendTo,
		subject: subject,
		text: text
	};

	if (dropEmail) {
		console.error("Email dropped. Email data:");
		console.error(data);
		if (callback)
			callback();
	} else {
		mailgun.messages().send(data, function(err, body) {
			console.log(body);

			if (callback) {
				callback();
			}
		});
	}
};

module.exports.sendSMS = function(sendTo, sendFrom, body, callback) {
	var data = {
			to: sendTo,
			from: sendFrom,
			body: body
	};

	if (dropSMS) {
		console.error("SMS dropped. SMS data:");
		console.error(data);
		if (callback)
			callback();
	} else {
		twilioClient.sms.message.create(data, function(err, message) {
			if (err) {
				console.log('Unable to send SMS');
			} else {
				console.log('Successfully sent SMS. SID is: ');
				console.log(message.sid);

				console.log('Sent on: ');
				console.log(message.dateCreated);
			}

			if (callback) {
				callback();
			}
		});
	}
};

/*
 * Compares DateOnly objects
 * -1 if d1 comes before d2
 * 0 if d1 is the same day as d2
 * 1 if d1 comes after d2
 */
module.exports.compareDateOnly = function(d1, d2) {
	if(d1.getFullYear() < d2.getFullYear()) {
		return -1;
	} else if (d1.getFullYear() > d2.getFullYear()) {
		return 1;
	} else {
		if(d1.getMonth() < d2.getMonth()) {
			return -1;
		} else if(d1.getMonth() > d2.getMonth()) {
			return 1;
		} else {
			if(d1.getDay() < d2.getDay()) {
				return -1;
			} else if(d1.getDay() > d2.getDay()) {
				return 1;
			} else {
				return 0;
			}
		}
	}
}


