/* jshint node: true */
/**
 * This file provides default configurations.
 *
 * Copy this file and rename it as 'environment.js' and node will overwrite
 * the corresponding environment variables with your configuration.
 *
 * Note: you can add any environment variables that you would like available
 */

module.exports = {
	NODE_ENV: 'development',
	SESSION_SECRET: 'drtwxroGWs9f93AQWbALN8Q7cvgNe4',
	DATABASE_URL: 'mongodb://localhost:27017/bonvoyage',

	// The Google Spreadsheet key where the Peace Corps Leave Requests can be found
	PC_SPREADSHEET_KEY: '',

	// Leaving the following three config options as undefined will cause the app
	// to silently drop SMS and email. Simply set them to the corresponding
	// Twilio or Mailgun keys and the app will use them.
	TWILIO_AUTH: undefined,
	TWILIO_SID: undefined,
	MAILGUN_KEY: undefined,

	// The public-facing domain where this site is hosted: this will be seen
	// when links are provided in email and SMS.
	BONVOYAGE_DOMAIN: 'localhost:3000',

	// The phone number that Twilio will send texts from.
	BONVOYAGE_NUMBER: '+11234567890',
};
