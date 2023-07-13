window.addEventListener('load', () => {
	loadCSS(config.settings.get('theme').url);
});

window.addEventListener('error', (e) => {
	parent.logger.error(`${e.filename}\n${e.lineno}\n\n${e.message}`);
});

window.loadJS = (FILE_URL, defer = true, type = 'text/javascript') => {
	return new Promise((resolve, reject) => {
		try {
			const scriptEle = document.createElement('script');
			scriptEle.type = type;
			scriptEle.defer = defer;
			scriptEle.src = FILE_URL;

			scriptEle.addEventListener('load', (ev) => {
				resolve({
					status: true
				});
			});

			scriptEle.addEventListener('error', (ev) => {
				reject({
					status: false,
					message: `Failed to load the script ${FILE_URL}`
				});
			});

			document.body.appendChild(scriptEle);
		} catch (error) {
			reject(error);
		}
	});
};

window.loadCSS = (FILE_URL) => {
	const styleEle = document.createElement('link');

	styleEle.setAttribute('rel', 'stylesheet');
	styleEle.setAttribute('type', 'text/css');
	styleEle.setAttribute('href', FILE_URL);

	document.head.appendChild(styleEle);
};