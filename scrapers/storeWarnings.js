/* jshint node: true */
/* jshint loopfunc:true */
/* jshint -W117 */
/* jshint -W082 */
'use strict';

require(__dirname + '/../setup');

var helpers = require(__dirname + '/../routes/helpers');
var mongoose = require('mongoose');
var uuid = require('node-uuid');
var User = require(__dirname + '/../models/user');
var Warning = require(__dirname + '/../models/warning');
var Request = require(__dirname + '/../models/request');
var mongoConnection = require(__dirname + '/../config/mongoConnection');

mongoose.connect(mongoConnection.getConnectionString());

function removeAll(newBatchUUID, source) {
	console.log('Removing all ' + source +
		' warnings except batch: ' + newBatchUUID);
	Warning.find({ source: source, batchUUID: { $ne: newBatchUUID } })
		.remove()
		.exec(function (err, response) {
			if (err) {
				console.error('An error occurred while attempting to remove ' +
					source + ' warnings.');
				throw err;
			} else {
				console.log('Removed ' + response.result.n + ' ' + source + ' warnings.');
				mongoose.connection.close();
			}
		});
}

function notifyUsers(users, countryCode) {
	if (users) {
		for (var i = 0; i < users.length; i++) {
			var body = 'Peace Corps: New travel warnings have been issued in ' + countryCode +
				'. Please review any relevant travel requests.';
			var phones = users[i].phones;
			for (var j = 0; j < phones.length; j++) {
				helpers.sendSMS(phones[j], body);
			}
		}
	}
}

function notifyCountryUsers(countryCode) {
	User.find({ countryCode: countryCode })
		.exec(function (err, users) {
			notifyUsers(users, countryCode);
		});

	Request.find({
		legs: {
			$elemMatch: {
				country: countryCode,
				endDate: {
					$gte: Date.now,
				},
			},
		},
	})
		.exec(function (err, requests) {
			if (requests) {
				for (var i = 0; i < requests.length; i++) {
					User.findById(requests[i].volunteer, function (err, volunteer) {
						notifyUsers([volunteer], countryCode);
					});
				}
			}
		});
}

function getWarningsKey(warning) {
	return warning.textOverview;
}

function getWarningsSet(existingWarnings) {
	var set = new Set();
	var key = null;
	var warning = null;

	for (var i = 0; i < existingWarnings.length; i++) {
		warning = existingWarnings[i];
		key = getWarningsKey(warning);
		set.add(key);
	}

	return set;
}

function isNewWarning(warningsSet, warning) {
	return !(warningsSet.has(getWarningsKey(warning)));
}

var storeWarnings = function (warnings) {
	Warning.find({})
		.exec(function (err, existingWarnings) {
		if (err) {
			console.error('Could not access existing warings');
			throw err;
		} else {
			var set = getWarningsSet(existingWarnings);

			var batchUUID = uuid.v1();
			var count = warnings.length;
			var countries = new Set();

			function onFinish(doc, source) {
				return function (err) {
					count--;

					if (isNewWarning(set, doc)) {
						countries.add(doc.countryCode);
					}

					if (err) {
						console.error('(Batch: ' + batchUUID +
							'): Inserting the following warning failed:');
						console.error(doc);
						console.error(err);
					}

					if (count === 0) {
						countries.forEach(function (country) {
							notifyCountryUsers(country);
						});

						removeAll(batchUUID, source);
					}
				};
			}

			if (count > 0) {
				var source = warnings[0].source;
				console.log('Inserting ' + count + ' warnings (Batch: ' + batchUUID + ')');

				for (var i = 0; i < warnings.length; i++) {
					warnings[i].batchUUID = batchUUID;
					new Warning(warnings[i]).save(onFinish(warnings[i], source));
				}
			}
		}
	});
};

module.exports = storeWarnings;
