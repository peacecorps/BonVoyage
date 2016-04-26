/* jshint node: true */

module.exports.getConnectionString = function () {
	'use strict';

	switch (process.env.NODE_ENV) {
		case 'production':
			return process.env.MONGO_PROD_CONNECTION_STRING;
		case 'test':
			return process.env.MONGO_TEST_CONNECTION_STRING;
		default:
			return process.env.MONGO_DEV_CONNECTION_STRING;
	}
};

module.exports.getEnvironmentPort = function () {
	'use strict';

	switch (process.env.NODE_ENV) {
		case 'test':
			return process.env.TEST_PORT;
		case 'production':
			return process.env.PROD_PORT;
		default:
			return process.env.DEV_PORT;
	}
};
