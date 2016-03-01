/* globals window */
/* globals moment */
/* globals DateOnly */

var UTC_FORMAT = 'ddd MMM DD YYYY';
var UTC_FORMAT_TIME = 'ddd MMM DD YYYY HH:mm:ss zZZ';
var ISO_FORMAT = 'YYYY-MM-DD';
var DISPLAY_FORMAT = "MMM DD, YYYY";
var PICKADATE_DISPLAY_FORMAT = "mmm dd, yyyy";
var warnings;
var pcWarnings;
var allWarnings;

function format_time(time, format) {
	if (time === undefined) {
		return "None";
	} else {
		return moment(time, format).format("LLL");
	}
}

function format_dateonly(date) {
	if (date === undefined) {
		return "None";
	} else {
		var newDate = new DateOnly(date);
		return moment(newDate.toDate()).format(DISPLAY_FORMAT);
	}
}

// http://stackoverflow.com/questions/196972/convert-string-to-title-case-with-javascript
function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

function combineWarnings(w, pcW) {
	var returnedWarnings = w;
	var pcCountries = Object.keys(pcW);
	for(var i = 0; i < pcCountries.length; i++) {
		var cc = pcCountries[i];
		if(returnedWarnings[cc] === undefined) {
			returnedWarnings[cc] = pcW[cc];
		} else {
			returnedWarnings[cc] = returnedWarnings[cc].concat(pcW[cc]);
		}
	}
	return returnedWarnings;
}

/*
 * The first time that this function is called, the warnings
 * will be fetched from the server. Every time after, the warnings
 * will be cached.
 */
function getWarnings(callback) {
	// Laze load the warnings and the Peace Corps warnings from the server
	if (allWarnings) {
		if (callback) {
			callback(allWarnings);
		}
	} else {
		if(!warnings) {
			$.ajax({
				url: "/data/warnings.json",
				dataType: "json",
				success: function(w) {
					warnings = w;
					if (pcWarnings) {
						allWarnings = combineWarnings(warnings, pcWarnings);
					}
					if(callback) {
						callback(allWarnings);
					}
				}
			});
		}
		if(!pcWarnings) {
			$.ajax({
				url: "/data/pcWarnings.json",
				dataType: "json",
				success: function(pcW) {
					pcWarnings = pcW;
					if (warnings) {
						allWarnings = combineWarnings(warnings, pcWarnings);
					}
					if(callback) {
						callback(allWarnings);
					}
				}
			});
		}
	}
}

$(function() {
	$('#logout').click(function() {
		$.ajax({
			method: "POST",
			url: "/api/logout",
			dataType: "json",
			success: function(resp) {
				if (resp.redirect) {
					window.location.href = resp.redirect;
				}
			}
		});
	});
});
