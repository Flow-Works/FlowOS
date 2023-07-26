/* eslint-env browser */

import { loadCSS } from './utilities.js';
import { config } from './managers.js';

window.addEventListener('load', () => {
	loadCSS(config.settings.get('theme').url);
});

window.addEventListener('error', (e) => {
	console.error(`${e.filename} at line ${e.lineno}: ${e.message}`);
});

window.loadJS = (FILE_URL, callback) => {
	const script = document.createElement('script');
	script.src = FILE_URL;
	script.type = 'text/javascript';

	document.body.appendChild(script);

	script.addEventListener('load', () => {
		if (typeof callback == 'function')
			callback();

	});
};

window.loadCSS = (FILE_URL) => {
	const styleEle = document.createElement('link');

	styleEle.setAttribute('rel', 'stylesheet');
	styleEle.setAttribute('type', 'text/css');
	styleEle.setAttribute('href', FILE_URL);

	document.head.appendChild(styleEle);
};