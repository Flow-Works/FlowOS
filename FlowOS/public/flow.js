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
		if (!config.setup.get()) {
			new WinBox({
				title: 'Setup Wizard',
				class: ['no-close', 'no-move', 'no-close', 'no-min', 'no-full', 'no-resize'],
				x: 'center',
				y: 'center',
				height: '500px',
				html: `<iframe src="/builtin/apps/setup.html" scrolling="yes"></iframe>`,
			});
		} else {
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
					Flow.bar.items['spotlight'].setText('🔎');
					document.querySelector('.app-switcher').style.opacity = 0;
					await sleep(200);
					document.querySelector('.app-switcher').style.display = 'none';
					this.state = false;
					break;
				case false:
					Flow.bar.items['spotlight'].setText('❌');
					document.querySelector('.app-switcher').style.opacity = 0;
					document.querySelector('.app-switcher').style.display = 'block';
					await sleep(200);
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
					if (type == 'textarea') {
						obj[SETTING_INPUT_ID] = defaultValue.split('\n');
					} else {
						obj[SETTING_INPUT_ID] = defaultValue;
					}
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
		hotkeys('alt+space', (e) => {
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
			if (window.apps()[APP_ID].proxy == false) {
				url = window.apps()[APP_ID].url;
			} else {
				url = 'https://' + window.location.hostname + '/' + __uv$config.prefix + __uv$config.encodeUrl(window.apps()[APP_ID].url);
			}
			logger.debug(url);
			new WinBox({
				title: window.apps()[APP_ID].title,
				icon: `assets/icons/${APP_ID}.svg`,
				html: `<iframe src="${url}" scrolling="yes"></iframe>`,
				x: 'center',
				y: 'center',
				...window.apps()[APP_ID].config
			});
		}
	};
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}