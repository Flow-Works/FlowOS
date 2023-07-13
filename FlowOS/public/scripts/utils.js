window.stockSW = '/uv/sw.js';
window.swAllowedHostnames = ['localhost', '127.0.0.1'];

window.config = {
	css: {
		get() {
			return window.localStorage.getItem('css');
		},
		set(value) {
			return window.localStorage.setItem('css', value);
		},
	},
	password: {
		get() {
			return window.localStorage.getItem('password');
		},
		set(value) {
			return window.localStorage.setItem('password', value);
		},
	},
	apps: {
		get() {
			return JSON.parse(window.localStorage.getItem('apps'));
		},
		set(value) {
			return window.localStorage.setItem('apps', JSON.stringify(value));
		},
	},
	settings: {
		get(item) {
			return JSON.parse(window.localStorage.getItem(item));
		},
		set(item, value) {
			return window.localStorage.setItem(item, JSON.stringify(value));
		},
	}
};

window.utils = {
	async registerSW() {
		if ('serviceWorker' in navigator) {
			await navigator.serviceWorker.register(stockSW, {
					scope: __uv$config.prefix,
				}).then(() => {
					logger.image('/assets/logo.svg');
				})
				.catch(() => logger.error('Failed to register serviceWorker.'));
		}
	},

	loadCSS(FILE_URL) {
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
	},

	loadJS(FILE_URL, async = true) {
		const scriptEle = document.createElement('script');

		scriptEle.setAttribute('src', FILE_URL);
		scriptEle.setAttribute('type', 'text/javascript');
		scriptEle.setAttribute('async', async);

		document.body.appendChild(scriptEle);

		scriptEle.addEventListener('load', () => {
			logger.info(`Script loaded: ${FILE_URL}`);
		});

		scriptEle.addEventListener('error', (ev) => {
			logger.error(`Failed to load script: ${FILE_URL}`, ev);
		});
	}
};