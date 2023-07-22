/* eslint-env browser */
/* global __uv$config __stomp$config */

import Logger from './scripts/logger.js';
import { registerSettings, useCustomCSS, sleep } from './scripts/utilities.js';
import { config } from './scripts/managers.js';

import FlowInstance from './flow.js';

import './uv/uv.config.js';
import './stomp/bootstrapper.js';
import './stmp/stomp.js';

window.immortalize = async () => {
	console.log('Loading 3MB Tailwind Package...');
	await sleep(500);
	console.log('Immortalizing OS...');
	await sleep(200);
	console.log('Rebooting...');
	await config.settings.set('theme', {'url':'/builtin/themes/immortal.css'});
	await sleep(200);
	window.location.reload();
};

self.Flow = new FlowInstance();
self.logger = new Logger();

window.onload = () => {
	registerSettings();
	switch (config.settings.get('search').proxy) {
		case 'STomp':
			self.currentProxy = __stomp$config;
			break;
		case 'Ultraviolet':
			self.currentProxy = __uv$config;
			break;
	}

	useCustomCSS();

	window.Flow.boot();
};

document.querySelector('.searchbar').onkeyup = () => {
	const input = document.querySelector('.searchbar').value.toLowerCase();
	let x = Array.from(document.querySelector('ul.apps').children);

	x.forEach((item) => {
		if (!item.innerText.toLowerCase().includes(input)) {
			item.style.display='none';
		}
		else {
			item.style.display='flex';                 
		}
	});
};