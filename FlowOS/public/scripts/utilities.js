/* eslint-env browser */
/* global __uv$config */

import { SettingsCategory, SettingsInput, SettingsTextarea, SettingsDropdown } from './classes.js';
import { config } from './managers.js';
import Logger from './logger.js';

const logger = new Logger();

export const registerSW = async () => {
	if ('serviceWorker' in navigator) {
		await navigator.serviceWorker.register('/uv/sw.js', {
			scope: __uv$config.prefix,
		}).catch(() => window.logger.error('Failed to register serviceWorker.'));
		return true;
	}
};

export const loadCSS = (FILE_URL) => {
	const styleEle = document.createElement('link');

	styleEle.setAttribute('rel', 'stylesheet');
	styleEle.setAttribute('type', 'text/css');
	styleEle.setAttribute('href', FILE_URL);

	document.head.appendChild(styleEle);

	styleEle.addEventListener('load', () => {
		logger.info(`Stylesheet loaded: ${FILE_URL}`);
		return true;
	});

	styleEle.addEventListener('error', (ev) => {
		logger.info(`Failed to load stylesheet: ${FILE_URL}`, ev);
		return false;
	});
};

export const loadJS = (FILE_URL, module = true, async = true) => {
	const scriptEle = document.createElement('script');

	scriptEle.setAttribute('src', FILE_URL);
	scriptEle.setAttribute('type', 'text/javascript');
	scriptEle.setAttribute('type', module ? 'module' : '');
	scriptEle.setAttribute('async', async);

	document.body.appendChild(scriptEle);

	scriptEle.addEventListener('load', () => {
		logger.info(`Script loaded: ${FILE_URL}`);
		return true;
	});

	scriptEle.addEventListener('error', (ev) => {
		logger.error(`Failed to load script: ${FILE_URL}`, ev);
		return false;
	});
};

export const sleep = (ms) => {
	return new Promise(resolve => setTimeout(resolve, ms));
};

export const registerSettings = () => {
	new SettingsCategory('profile', 'Profile', [
		new SettingsInput('username', 'Username', '', ''),
		new SettingsInput('url', 'Image URL', 'https://mysite.to/image.png', '')
	]);

	new SettingsCategory('search', 'Browser', [
		new SettingsInput('url', 'Search Engine URL', 'https://duckduckgo.com', 'https://duckduckgo.com'),
		new SettingsTextarea('urls', 'Extension URLs', 'https://mysite.to/script1.js\nhttps://mysite.to/script2.js\nhttps://mysite.to/script3.js', ''),
		new SettingsDropdown('proxy', 'Proxy', 'Ultraviolet', ['Ultraviolet', 'STomp'])
	]);

	new SettingsCategory('theme', 'Theme', [
		new SettingsInput('url', 'Theme URL', 'https://mysite.to/theme.css', '/builtin/themes/catppuccin-macchiato.css')
	]);

	new SettingsCategory('modules', 'Modules/Scripts', [
		new SettingsTextarea('urls', 'Module URLs', 'https://mysite.to/script1.js\nhttps://mysite.to/script2.js\nhttps://mysite.to/script3.js', '/builtin/modules/battery.js\n/builtin/modules/clock.js\n/builtin/modules/weather.js')
	]);

	return true;
};

export const useCustomCSS = () => {
	const style = document.createElement('style');
	style.setAttribute('flow-style', 'true');
	style.innerHTML = config.css.get();
	document.head.append(style);
	return true;
};