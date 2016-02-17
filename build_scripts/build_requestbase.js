/* jshint node: true */
'use strict';

var mongoose = require("mongoose");
var Access = require('../config/access');
var ipsum = require('lorem-ipsum');
var sprintf = require("sprintf-js").sprintf;
var moment = require('moment');
var fs = require('fs');
var DateOnly = require('dateonly');
var countries_dictionary = JSON.parse(fs.readFileSync("../public/data/countryList.json", 'utf8'));
var country_codes = Object.keys(countries_dictionary);
var n_countries = country_codes.length;
var User = require("../models/user");
var Request = require("../models/request");

var REQUESTS_TO_GENERATE = 100; // * Math.floor((50 * Math.random()));
var DRY_RUN = false;

mongoose.connect('mongodb://localhost:27017/bonvoyage');
mongoose.connection.on('error', function(err){
	if (err) {
		console.log(err);
	}
});

function randIndex(length) {
	return Math.floor((Math.random() * length));
}

// Returns boolean with cutoff% likeliehood of being true
// Defaults to 0.5
function randBool(cutoff) {
	return Math.random() < (cutoff ? cutoff : 0.5);
}

function randCountryCode() {
	return country_codes[randIndex(n_countries)];
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
		start_date: dates[0],
		end_date: dates[1],
		country: countries_dictionary[cc],
		country_code: cc,
		hotel: ipsum(),
		contact: ipsum(),
		companions: ipsum(),
		description: ipsum()
	};
}

function generateRequest(email) {
	var is_pending = randBool(0.3);
	var is_approved = (is_pending ? undefined : randBool(0.7));
	var legs = [];
	while(legs.length === 0 || randBool(0.4)) {
		legs.push(generateLeg());
	}
	return new Request({
		email: email,
		status: {
			is_pending: is_pending,
			is_approved: is_approved
		},
		legs: legs,
		comments: []
	});
}

function saveAll(objects, cb){
	var count = objects.length;
	var handleSave = function(err) {
		if (err) {
			console.error(err);
		} else {
			count -= 1;
			if (count % 5 === 0) {
				console.log(sprintf("%d requests left to save...", count));
			}
			if(count === 0) {
				cb();
			}
		}
	};
	for(var i = 0; i < objects.length; i++) {
		var object = objects[i];
		object.save(handleSave);
	}
}

console.log(sprintf("Generating %d requests...", REQUESTS_TO_GENERATE));

User.find({ access: Access.VOLUNTEER }, function(err, users) {
	if (err) {
		console.error(err);
	}
	var requests = [];
	for(var i = 0; i < REQUESTS_TO_GENERATE; i++) {
		var rand_user = users[randIndex(users.length)];
		var random_email = rand_user.email;
		console.log(random_email);
		requests.push(generateRequest(random_email));
	}
	console.log(sprintf("About to save %d requests.", requests.length));
	
	if(DRY_RUN) {
		console.log(requests);
		mongoose.connection.close();
	} else {
		saveAll(requests, function() {
			console.log(sprintf("Finished saving."));
			mongoose.connection.close();
		});
	}
});