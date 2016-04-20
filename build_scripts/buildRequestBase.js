/* jshint node: true */
'use strict';

module.exports = function (options, done) {
	var Access = require(__dirname + '/../config/access');
	var ipsum = require('lorem-ipsum');
	var sprintf = require('sprintf-js').sprintf;
	var moment = require('moment');
	var fs = require('fs');
	var DateOnly = require('dateonly');
	var countryFilePath = __dirname + '/../public/data/countryList.json';
	var countryListFile = fs.readFileSync(countryFilePath, 'utf8');
	var countriesDictionary = JSON.parse(countryListFile);
	var countryCodes = Object.keys(countriesDictionary);
	var nCountries = countryCodes.length;
	var User = require(__dirname + '/../models/user');
	var Request = require(__dirname + '/../models/request');
	var seedrandom = require('seedrandom');

	var REQUESTS_TO_GENERATE = options.nrequests || 100;
	var SEED = options.seed || 12345;

	var rng = seedrandom(SEED);

	function randIndex(length) {
		return Math.floor(rng() * length);
	}

	// Returns boolean with cutoff% likeliehood of being true
	// Defaults to 0.5
	function randBool(cutoff) {
		return rng() < (cutoff ? cutoff : 0.5);
	}

	function randCountryCode() {
		return countryCodes[randIndex(nCountries)];
	}

	function randDatePair() {
		var timeUntilLeave = randIndex(200) - 20;
		var start = moment();
		start.add(timeUntilLeave, 'days');
		var lengthOfVacation = randIndex(20);
		var end = moment(start);
		end.add(lengthOfVacation, 'days');
		return [new DateOnly(start), new DateOnly(end)];
	}

	function generateLeg() {
		var cc = randCountryCode();
		var dates = randDatePair();
		return {
			startDate: dates[0],
			endDate: dates[1],
			city: ipsum({ count: 1, units: 'words' }),
			country: countriesDictionary[cc],
			countryCode: cc,
			hotel: ipsum(),
			contact: ipsum(),
			companions: ipsum(),
			description: ipsum({ count: randIndex(3), units: 'sentences' }),
		};
	}

	function generateRequest(user, staff) {
		var isPending = randBool(0.3);
		var isApproved = (isPending ? undefined : randBool(0.7));
		var legs = [];
		while (legs.length === 0 || randBool(0.4)) {
			legs.push(generateLeg());
		}

		return new Request({
			volunteer: user,
			staff: staff,
			status: {
				isPending: isPending,
				isApproved: isApproved,
			},
			legs: legs,
			comments: [],
			counterpartApproved: true,
		});
	}

	function saveAll(objects) {
		var count = objects.length;
		var handleSave = function (err) {
			if (err) {
				done(err);
			} else {
				count -= 1;

				if (count === 0) {
					done(null);
				}
			}
		};

		for (var i = 0; i < objects.length; i++) {
			var object = objects[i];
			object.save(handleSave);
		}
	}

	User.find({  }, function (err, users) {
		if (err) {
			done(err);
		} else {
			var volunteers = [];
			var staff = [];
			for (var i = 0; i < users.length; i++) {
				if (users[i].access == Access.VOLUNTEER) {
					volunteers.push(users[i]);
				} else {
					staff.push(users[i]);
				}
			}

			var requests = [];
			for (i = 0; i < REQUESTS_TO_GENERATE; i++) {
				var randVolunteer = users[randIndex(volunteers.length)];
				var randStaff = staff[randIndex(staff.length)];
				requests.push(generateRequest(randVolunteer, randStaff));
			}

			saveAll(requests);
		}
	});
};
