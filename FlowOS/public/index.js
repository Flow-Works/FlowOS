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