'use strict';

if (location.pathname.startsWith(__uv$config.prefix)) {
	logger.error('The service worker is not registered.');

	try {
		utils.registerSW();
	} catch (err) {
		logger.error('Failed to register service worker.');
	}
};