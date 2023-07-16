/* eslint-env browser */
/* global __uv$config */

import Logger from './logger.js';
const logger = new Logger();

const stockSW = '/uv/sw.js';

const registerSW = async () => {
	if ('serviceWorker' in navigator) {
		await navigator.serviceWorker.register(stockSW, {
				scope: __uv$config.prefix,
			}).then(() => {
				
			})
			.catch(() => logger.error('Failed to register serviceWorker.'));
	}
};

const loadCSS = (FILE_URL) => {
	const styleEle = document.createElement('link');

	styleEle.setAttribute('rel', 'stylesheet');
	styleEle.setAttribute('type', 'text/css');
	styleEle.setAttribute('href', FILE_URL);

	document.head.appendChild(styleEle);

	styleEle.addEventListener('load', () => {
		logger.info(`Stylesheet loaded: ${FILE_URL}`);
	});

	styleEle.addEventListener('error', (ev) => {
		logger.info(`Failed to load stylesheet: ${FILE_URL}`, ev);
	});
};

const loadJS = (FILE_URL, module = true, async = true) => {
	const scriptEle = document.createElement('script');

	scriptEle.setAttribute('src', FILE_URL);
	scriptEle.setAttribute('type', 'text/javascript');
	scriptEle.setAttribute('type', module ? 'module' : '');
	scriptEle.setAttribute('async', async);

	document.body.appendChild(scriptEle);

	scriptEle.addEventListener('load', () => {
		logger.info(`Script loaded: ${FILE_URL}`);
	});

	scriptEle.addEventListener('error', (ev) => {
		logger.error(`Failed to load script: ${FILE_URL}`, ev);
	});
};

const sleep = (ms) => {
	return new Promise(resolve => setTimeout(resolve, ms));
};

export { registerSW, loadCSS, loadJS, sleep };