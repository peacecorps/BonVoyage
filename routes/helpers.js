/* jshint node: true */
'use strict';

var User = require('../models/user');
var Request = require('../models/request');
var Access = require('../config/access');
var phoneNumber = require('../config/phone');
var DateOnly = require('dateonly');
var moment = require('moment');
var jade = require('jade');
var path = require('path');
var fs = require('fs');
var countryFilePath = 'public/data/countryList.json';
var countryListFile = fs.readFileSync(countryFilePath, 'utf8');
var countriesDictionary = JSON.parse(countryListFile);

// Attempt to load credentials for email and SMS
var dropEmail = false;
var dropSMS = false;

try {
	var credentials = require('../config/credentials');
} catch (exc) {
	console.error('Credentials file not found. (../config/credentials).' +
	' Email and SMS will be dropped silently.');
	dropEmail = true;
	dropSMS = true;
}

try {
	var domain = require('../config/domain');
} catch (exc) {
	console.error('Domain file not found. (../config/domain).' +
		' Email will be dropped silently.');
	dropEmail = true;
}

if (credentials && credentials.mailgun && domain) {
	var mailgunAPIKey = credentials.mailgun;
	var mailgun = require('mailgun-js')({ apiKey: mailgunAPIKey, domain: domain });
	var mailcomposer = require('mailcomposer');
} else {
	dropEmail = true;
}

if (credentials && credentials.twilio) {
	var twilio = require('twilio');
	var twilioCfg = credentials.twilio;
	var twilioClient = new twilio.RestClient(twilioCfg.accountSid,
		twilioCfg.authToken);
} else {
	dropSMS = true;
}

/*
 * Helper Functions
 */
module.exports.getStartDate = function (request) {
	if (request.legs.length > 0) {
		var startDate = new DateOnly(request.legs[0].startDate);
		for (var i = 1; i < request.legs.length; i++) {
			var d = new DateOnly(request.legs[i].startDate);
			if (d < startDate) {
				startDate = d;
			}
		}

		return startDate;
	} else {
		return undefined;
	}
};

module.exports.getEndDate = function (request) {
	if (request.legs.length > 0) {
		var endDate = new DateOnly(request.legs[0].endDate);
		for (var i = 1; i < request.legs.length; i++) {
			var d = new DateOnly(request.legs[i].endDate);
			if (d > endDate) {
				endDate = d;
			}
		}

		return endDate;
	} else {
		return undefined;
	}
};

module.exports.getRequests = function (req, res, pending, cb) {
	if (req.user) {
		var matchUser = {};
		if (req.user.access < Access.STAFF) {
			matchUser.userId = req.user._id;
		}

		var matchCountry = {};
		if (req.user.access == Access.STAFF) {
			matchCountry['user.countryCode'] = req.user.countryCode;
		}

		Request.aggregate([
			{
				$match: matchUser,
			},
			{
				// JOIN with the user data belonging to each request
				$lookup: {
					from: 'users',
					localField: 'userId',
					foreignField: '_id',
					as: 'user',
				},
			},
			{
				// Only one user will ever match (emails are unique)
				// Convert the user key to a single document from an array
				$unwind: '$user',
			},
			{
				$match: matchCountry,
			},
			{
				$match: (pending !== undefined ? { 'status.isPending': pending } : {}),
			},
		], function (err, requests) {
			if (err) {
				return cb(err);
			} else {
				// Add start and end date to all requests
				for (var i = 0; i < requests.length; i++) {
					requests[i].startDate = module.exports.getStartDate(requests[i]);
					requests[i].endDate = module.exports.getEndDate(requests[i]);
				}

				cb(null, requests);
			}
		});
	} else {
		cb(new Error('User not logged in!'));
	}
};

module.exports.getUsers = function (options, cb) {
	var q = (options.user !== undefined ? options.user : {});
	if (options.maxAccess !== undefined) {
		q.access = { $lte: options.maxAccess };
	}

	// Note: using lean() so that users is a JS obj, instead of a Mongoose obj
	User.find(q, 'access name email phone _id countryCode').lean().exec(
		function (err, users) {
		if (err) {
			cb(err);
		} else {
			for (var i = 0; i < users.length; i++) {
				users[i].country = countriesDictionary[users[i].countryCode];
			}

			cb(null, users);
		}
	});
};

module.exports.sendEmail = function (sendFrom, sendTo, subject, text,
	callback) {
	var data = {
		from: sendFrom,
		to: sendTo,
		subject: subject,
		text: text,
	};

	if (dropEmail) {
		console.error('Email dropped. Email data:');
		console.error(data);
		if (callback) {
			callback();
		}
	} else {
		mailgun.messages().send(data, function (err, body) {
			console.log(body);

			if (callback) {
				callback();
			}
		});
	}
};

module.exports.sendTemplateEmail = function (sendFrom, sendTo, subject,
	template, map, callback) {

	var html = jade.renderFile(path.join(__dirname, '../email',
		template + '.jade'), map);

	var data = {
		from: sendFrom,
		to: sendTo,
		subject: subject,
		html: html,
	};

	if (dropEmail) {
		console.error('Email dropped. Email data:');
		console.error(data);
		if (callback) {
			callback();
		}
	} else {
		var mail = mailcomposer(data);

		mail.build(function (buildError, message) {
			if (buildError) {
				console.log(buildError);
			}

			var dataToSend = {
				to: sendTo,
				message: message.toString('ascii'),
			};

			mailgun.messages().sendMime(dataToSend, function (sendError, body) {
				if (sendError) {
					console.log(sendError);
				}

				if (body) {
					console.log('Email data:' + body);
				}

				if (callback) {
					callback();
				}
			});
		});
	}
};

module.exports.postComment = function (
	requestId, name, userId, commentMessage, cb) {
	Request.findByIdAndUpdate(requestId, {
		$push: {
			comments: {
				$each:[
					{
						name: name,
						userId: userId,
						content: commentMessage,
					},
				],
			},
		},
	}, function (err) {
		cb(err);
	});
};

module.exports.formatDateOnly = function (date) {
	var dateonly = new DateOnly(parseInt(date + ''));
	var formatteddate = moment(dateonly.toDate()).format('MMM DD, YYYY');
	console.log(formatteddate);
	return formatteddate;
};

module.exports.sendSMS = function (sendTo, body, callback) {
	var data = {
		to: sendTo,
		from: phoneNumber,
		body: body,
	};

	if (dropSMS) {
		console.error('SMS dropped. SMS data:');
		console.error(data);
		if (callback) {
			callback();
		}
	} else {
		twilioClient.messages.create(data, function (err, message) {
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
