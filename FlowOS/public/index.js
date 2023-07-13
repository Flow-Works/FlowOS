class FlowInstance {
	version = 'v1.0.0';

	constructor() {
		utils.registerSW();
	}

	boot() {
		document.querySelector('.boot').style.opacity = 0;
		setTimeout(() => {
			document.querySelector('.boot').style.pointerEvents = 'none';
		}, 700);

		if (!config.css.get()) config.css.set('');
		if (!config.apps.get()) config.apps.set([]);
		if (config.password.get()) {
			window.loginWindow = new WinBox({
				title: 'Login',
				class: ['no-close'],
				modal: true,
				html: `<iframe src="/builtin/apps/login.html" scrolling="yes"></iframe>`,
				onclose: () => {
					this.apps.register();
					this.registerHotkeys();
					config.settings.get('modules').urls.forEach(async (item) => {
						utils.loadJS(item);
					});
					const spotlight = new BarItem('spotlight');

					spotlight.setText('🔎');
					spotlight.element.onclick = () => {
						Flow.spotlight.toggle();
					};
				}
			});
		} else {
			window.localStorage.clear();
		}

		if (!config.password.get()) {
			config.settings.set('theme', { url: '/builtin/themes/catppuccin-dark.css' });
			new WinBox({
				title: 'Setup Wizard',
				class: ['no-close', 'no-move', 'no-close', 'no-min', 'no-full', 'no-resize'],
				x: 'center',
				y: 'center',
				height: '500px',
				html: `<iframe src="/builtin/apps/setup.html" scrolling="yes"></iframe>`,
			});
		}

		utils.loadCSS(config.settings.get('theme').url);
	}

	spotlight = {
		add(app) {
			document.querySelector('.app-switcher .apps').append(app);
		},

		async toggle() {
			switch (this.state) {
				case true:
					document.querySelector('.app-switcher').style.opacity = 1;
					Flow.bar.items.spotlight.setText('🔎');
					document.querySelector('.app-switcher').style.opacity = 0;
					await utils.sleep(200);
					document.querySelector('.app-switcher').style.display = 'none';
					this.state = false;
					break;
				case false:
					Flow.bar.items.spotlight.setText('❌');
					document.querySelector('.app-switcher').style.opacity = 0;
					document.querySelector('.app-switcher').style.display = 'block';
					await utils.sleep(200);
					document.querySelector('.app-switcher').style.opacity = 1;
					this.state = true;
					break;
			}
		},

		state: false,
	};

	settings = {
		items: {},

		add(ITEM) {
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
			this.items[ITEM.SETTING_ID] = ITEM;
		}
	};

	bar = {
		items: {},

		add(ITEM) {
			this.items[ITEM.MODULE_ID] = ITEM;
			document.querySelector('.bar').append(this.items[ITEM.MODULE_ID].element);
		}
	};

	registerHotkeys() {
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
	}

	apps = {
		register() {
			for (const [APP_ID, value] of Object.entries(window.apps())) {
				const appListItem = document.createElement('li');
				appListItem.innerHTML = `<img src="/assets/icons/${APP_ID}.svg" width="25px"/>${value.title}`;
				appListItem.onclick = () => {
					this.open(APP_ID);
					Flow.spotlight.toggle();
				};

				Flow.spotlight.add(appListItem);
			}
		},

		open(APP_ID) {
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
window.logger = new Logger();

window.onload = () => {
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
			'applications-apps': new AppData('applications-apps', 'App Store', '/builtin/apps/apps.html', false),
			...config.apps.get(),
		};
	};

	const style = document.createElement('style');
	style.setAttribute('flow-style', 'true');
	style.innerHTML = config.css.get();
	document.head.append(style);

	Flow.boot();
};

new SettingsCategory('profile', 'Profile',
	new SettingsInput('username', 'Username', '', ''),
	new SettingsInput('url', 'Image URL', 'https://mysite.to/image.png', '')
);

new SettingsCategory('search', 'Browser',
	new SettingsInput('url', 'Search Engine URL', 'https://duckduckgo.com', 'https://duckduckgo.com'),
	new SettingsTextarea('urls', 'Extension URLs', 'https://mysite.to/script1.js\nhttps://mysite.to/script2.js\nhttps://mysite.to/script3.js', '')
);

new SettingsCategory('theme', 'Theme',
	new SettingsInput('url', 'Theme URL', 'https://mysite.to/theme.css', '/builtin/themes/catppuccin-dark.css')
);

new SettingsCategory('modules', 'Modules/Scripts',
	new SettingsTextarea('urls', 'Module URLs', 'https://mysite.to/script1.js\nhttps://mysite.to/script2.js\nhttps://mysite.to/script3.js', '/builtin/modules/battery.js\n/builtin/modules/clock.js\n/builtin/modules/weather.js')
);