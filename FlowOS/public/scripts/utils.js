const stockSW = '/uv/sw.js';
const swAllowedHostnames = ['localhost', '127.0.0.1'];

window.config = {
	css: {
		get: function () {
			return window.localStorage.getItem('css');
		},
		set: function (value) {
			return window.localStorage.setItem('css', value);
		},
	},
	setup: {
		get: function () {
			return window.localStorage.getItem('setup');
		},
		set: function (value) {
			return window.localStorage.setItem('setup', value);
		},
	},
	password: {
		get: function () {
			return window.localStorage.getItem('password');
		},
		set: function (value) {
			return window.localStorage.setItem('password', value);
		},
	},
	apps: {
		get: function () {
			return JSON.parse(window.localStorage.getItem('apps'));
		},
		set: function (value) {
			return window.localStorage.setItem('apps', JSON.stringify(value));
		},
	},
	settings: {
		get: function (item) {
			return JSON.parse(window.localStorage.getItem(item));
		},
		set: function (item, value) {
			return window.localStorage.setItem(item, JSON.stringify(value));
		},
	}
};

const utils = {
	registerSW: async function () {
		if ('serviceWorker' in navigator) {
			await navigator.serviceWorker.register(stockSW, {
					scope: __uv$config.prefix,
				}).then(() => {
					logger.image('/assets/logo.svg');
				})
				.catch(() => logger.error('Failed to register serviceWorker.'));
		}
	},

	loadCSS: function (FILE_URL) {
		const styleEle = document.createElement('link');

		styleEle.setAttribute('rel', 'stylesheet');
		styleEle.setAttribute('type', 'text/css');
		styleEle.setAttribute('href', FILE_URL);

		document.head.appendChild(styleEle);

		// success event 
		styleEle.addEventListener('load', () => {
			logger.info('Stylesheet loaded: ' + FILE_URL);
		});
		// error event
		styleEle.addEventListener('error', (ev) => {
			logger.info('Failed to load stylesheet: ' + FILE_URL, ev);
		});
	},

	loadJS: function (FILE_URL, async = true) {
		let scriptEle = document.createElement('script');

		scriptEle.setAttribute('src', FILE_URL);
		scriptEle.setAttribute('type', 'text/javascript');
		scriptEle.setAttribute('async', async);

		document.body.appendChild(scriptEle);

		// success event 
		scriptEle.addEventListener('load', () => {
			logger.info('Script loaded: ' + FILE_URL);
		});
		// error event
		scriptEle.addEventListener('error', (ev) => {
			logger.error('Failed to load script: ' + FILE_URL, ev);
		});
	}
};