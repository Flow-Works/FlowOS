window.stockSW = '/uv/sw.js';
window.swAllowedHostnames = ['localhost', '127.0.0.1'];

window.config = {
	css: {
		get: () => {
			return window.localStorage.getItem('css');
		},
		set: (value) => {
			return window.localStorage.setItem('css', value);
		},
	},
	password: {
		get: () => {
			return window.localStorage.getItem('password');
		},
		set: (value) => {
			return window.localStorage.setItem('password', value);
		},
	},
	apps: {
		get: () => {
			return JSON.parse(window.localStorage.getItem('apps'));
		},
		set: (value) => {
			return window.localStorage.setItem('apps', JSON.stringify(value));
		},
	},
	settings: {
		get: (item) => {
			return JSON.parse(window.localStorage.getItem(item));
		},
		set: (item, value) => {
			return window.localStorage.setItem(item, JSON.stringify(value));
		},
	}
};

window.utils = {
	registerSW: async () => {
		if ('serviceWorker' in navigator) {
			await navigator.serviceWorker.register(stockSW, {
					scope: __uv$config.prefix,
				}).then(() => {
					logger.image('/assets/logo.svg');
				})
				.catch(() => logger.error('Failed to register serviceWorker.'));
		}
	},

	loadCSS: (FILE_URL) => {
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

	loadJS: (FILE_URL, async = true) => {
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
	},

	getBox: (width, height) => {
		return {
			string: '+',
			style: `font-size: 1px; padding: ${Math.floor(height / 10)}px ${Math.floor(width / 2)}px; line-height: ${height}px;`
		};
	},

	sleep: (ms) => {
		return new Promise(resolve => setTimeout(resolve, ms));
	}
};

class Logger {
	constructor() {}

	log(type, color, msg) {
		console.log(
			`%cFlowOS%c${type.toUpperCase()}%c ${msg}`,
			'padding:2.5px 10px;color:white;border-radius:10px;background:#363a4f;margin-right:5px;',
			`padding:2.5px 10px;color:white;border-radius:10px;background:${color};`,
			'padding:2.5px;'
		);
	}

	image(url, scale = 1) {
		const img = new Image();

		img.onload = function () {
			const dim = utils.getBox(this.width * scale, this.height * scale);
			console.log(`%c${dim.string}%c FlowOS\n ${Flow.version}`, `${dim.style}background: url(${url}); background-repeat: no-repeat; background-size: ${this.width * scale}px ${this.height * scale}px; color: transparent;`, '');
		};

		img.src = url;
	};

	info(msg) {
		this.log('info', '#8aadf4', msg);
	}

	error(msg) {
		this.log('error', '#ed8796', msg);

		new WinBox({
			title: 'Error',
			html: `<div class="err">${msg}<style>.err { padding: 5px; }</style></div>`,
			x: 'center',
			y: 'center',
			width: '300px',
			height: '200px'
		});
	}

	success(msg) {
		this.log('success', '#a6da95', msg);
	}

	debug(msg) {
		this.log('debug', '#c6a0f6', msg);
	}
}