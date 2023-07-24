/* eslint-env browser */
/* global WinBox */

import 'https://cdn.jsdelivr.net/npm/winbox@0.2.82';
import apps from './constants/apps.js';

export const windows = [];

export class WindowManager {
	constructor() {}

	open = (APP_ID) => {
		const app = apps()[APP_ID];
		window.logger.debug(JSON.stringify(app));
		new WindowInstance({
			title: app.title,
			icon: app.icon,
			url: app.url,
			x: 'center',
			y: 'center',
			...app.config,
		});
	};
}

export class WindowInstance {
	constructor(windowOptions) {
		windowOptions.icon = windowOptions.icon
			? windowOptions.icon
			: '/assets/icons/application.svg';
		windowOptions.proxy = windowOptions.proxy || false;
		windowOptions.url = this.#useProxy(windowOptions.proxy, windowOptions.url);
		this.instance = new WinBox(windowOptions);
		windows.push(this.instance);

		return { instance: this.instance };
	}

	#useProxy = (proxy, url) => {
		if (proxy)
			return self.currentProxy.prefix + self.currentProxy.encodeUrl(url);
		return url;
	};
}
