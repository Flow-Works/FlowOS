/* eslint-env browser */
/* global __uv$config __stomp$config WinBox */

import hotkeys from 'https://cdn.jsdelivr.net/npm/hotkeys-js@3.11.2/+esm';

import { _auth } from './scripts/firebase.js';

import Logger from './scripts/logger.js';
import { registerSW, loadCSS, sleep } from './scripts/utilities.js';
import config from './scripts/configManager.js';
import { AppData, SettingsCategory, SettingsInput, SettingsTextarea, SettingsDropdown } from './scripts/classes.js';

import './uv/uv.config.js';
import './stomp/bootstrapper.js';
import './stmp/stomp.js';

const logger = new Logger();

class FlowInstance {
	version = 'v1.0.0';
	init = false;
	setup = false;

	constructor() {
		registerSW();
	}

	boot = async () => {
		document.querySelector('.boot').style.opacity = 0;
		setTimeout(() => { document.querySelector('.boot').style.pointerEvents = 'none'; }, 700);

		loadCSS(config.settings.get('theme').url);

		if (!config.css.get()) config.css.set('');
		if (!config.apps.get()) config.apps.set([]);

		_auth.onAuthStateChanged(async (user) => {
			if (this.init || this.setup) parent.window.location.reload();
			if (user) {
				this.apps.register();
				this.registerHotkeys();
				const spotlight = await import('./builtin/modules/spotlight.js');
				await this.bar.add(spotlight.default);

				for (let i = 0; i < config.settings.get('modules').urls.length; i++) {
					const url = config.settings.get('modules').urls[i];
					const module = await import(url);
					await this.bar.add(module.default);
				};

				this.init = true;
				return;
			}
			new WinBox({
				title: 'Setup Wizard',
				class: ['no-close', 'no-move', 'no-close', 'no-min', 'no-full', 'no-resize'],
				x: 'center',
				y: 'center',
				height: '650px',
				html: `<iframe src="/builtin/apps/setup.html" title="Setup Wizard" scrolling="yes"></iframe>`,
			});
			this.setup = true;
		});
	};

	spotlight = {
		add: (app) => {
			document.querySelector('.app-switcher .apps').append(app);
		},

		toggle: async () => {
			switch (this.spotlight.state) {
				case true:
					document.querySelector('.app-switcher').style.opacity = 1;
					this.bar.items.spotlight.setText('🔎');
					document.querySelector('.app-switcher').style.opacity = 0;
					await sleep(200);
					document.querySelector('.app-switcher').style.display = 'none';
					this.spotlight.state = false;
					break;
				case false:
					this.bar.items.spotlight.setText('❌');
					document.querySelector('.app-switcher').style.opacity = 0;
					document.querySelector('.app-switcher').style.display = 'block';
					await sleep(200);
					document.querySelector('.app-switcher').style.opacity = 1;
					this.spotlight.state = true;
					break;
			}
		},

		state: false,
	};

	settings = {
		items: {},

		add: (ITEM) => {
			if (!config.settings.get(ITEM.SETTING_ID)) {
				const obj = {};
				ITEM.inputs.forEach(({
					type,
					SETTING_INPUT_ID,
					defaultValue
				}) => {
					obj[SETTING_INPUT_ID] = type == 'textarea' ? defaultValue.split('\n') : defaultValue;
				});
				config.settings.set(ITEM.SETTING_ID, obj);
			}
			this.settings.items[ITEM.SETTING_ID] = ITEM;
		}
	};

	bar = {
		items: {},

		add: (ITEM) => {
			this.bar.items[ITEM.MODULE_ID] = ITEM;
			document.querySelector('.bar').append(this.bar.items[ITEM.MODULE_ID].element);
		}
	};

	registerHotkeys = () => {
		hotkeys('alt+space, ctrl+space', (e) => {
			e.preventDefault();
			this.spotlight.toggle();
		});

		hotkeys('esc', (e) => {
			e.preventDefault();
			if (this.spotlight.state == true) this.spotlight.toggle();
		});

		hotkeys('alt+/', (e) => {
			e.preventDefault();
			this.apps.open('settings');
		});
	};

	apps = {
		register: () => {
			for (const [APP_ID, value] of Object.entries(window.apps())) {
				const appListItem = document.createElement('li');
				appListItem.innerHTML = `<img src="/assets/icons/${APP_ID}.svg" width="25px"/>${value.title}`;
				appListItem.onclick = () => {
					this.apps.open(APP_ID);
					this.spotlight.toggle();
				};

				this.spotlight.add(appListItem);
			}
		},

		open: (APP_ID) => {
			let url;
			logger.debug(JSON.stringify(window.apps()[APP_ID]));
			url = window.apps()[APP_ID].proxy == false ? window.apps()[APP_ID].url : `${__uv$config.prefix}${__uv$config.encodeUrl(window.apps()[APP_ID].url)}`;
			logger.debug(url);
			new WinBox({
				title: window.apps()[APP_ID].title,
				icon: `assets/icons/${APP_ID}.svg`,
				html: `<iframe src="${url}" scrolling="yes" title="${window.apps()[APP_ID].title}"></iframe>`,
				x: 'center',
				y: 'center',
				...window.apps()[APP_ID].config
			});
		}
	};
};

window.Flow = new FlowInstance();

window.onload = () => {
	new SettingsCategory('profile', 'Profile',
	new SettingsInput('username', 'Username', '', ''),
	new SettingsInput('url', 'Image URL', 'https://mysite.to/image.png', '')
);

new SettingsCategory('search', 'Browser',
	new SettingsInput('url', 'Search Engine URL', 'https://duckduckgo.com', 'https://duckduckgo.com'),
	new SettingsTextarea('urls', 'Extension URLs', 'https://mysite.to/script1.js\nhttps://mysite.to/script2.js\nhttps://mysite.to/script3.js', ''),
	new SettingsDropdown('proxy', 'Proxy', 'Ultraviolet', ['Ultraviolet', 'STomp'])
);

new SettingsCategory('theme', 'Theme',
	new SettingsInput('url', 'Theme URL', 'https://mysite.to/theme.css', '/builtin/themes/catppuccin-macchiato.css')
);

new SettingsCategory('modules', 'Modules/Scripts',
	new SettingsTextarea('urls', 'Module URLs', 'https://mysite.to/script1.js\nhttps://mysite.to/script2.js\nhttps://mysite.to/script3.js', '/builtin/modules/battery.js\n/builtin/modules/clock.js\n/builtin/modules/weather.js')
);
	switch (config.settings.get('search').proxy) {
		case 'STomp':
			self.currentProxy = __stomp$config;
			break;
		case 'Ultraviolet':
			self.currentProxy = __uv$config;
			break;
	}

	window.apps = () => {
		return {
			'help': new AppData('help', 'Help', 'https://flowos-thinliquid.webapp-store.de/', false),
			'info': new AppData('info', 'About', '/builtin/apps/about.html', false, {
				width: '300px',
				height: '500px',
				class: ['no-resize', 'no-max', 'no-full']
			}),
			'settings': new AppData('settings', 'Settings', '/builtin/apps/settings.html', false),
			'browser': new AppData('browser', 'Browser', '/builtin/apps/browser.html', false),
			'gameboy': new AppData('gameboy', 'Emulator', '/emu/', false),
			'applications-apps': new AppData('applications-apps', 'App Store', '/builtin/apps/apps.html', false),
			...config.apps.get(),
		};
	};

	const style = document.createElement('style');
	style.setAttribute('flow-style', 'true');
	style.innerHTML = config.css.get();
	document.head.append(style);

	window.Flow.boot();
};