window.Flow = new FlowInstance();
window.logger = new Logger();

window.onload = () => {
    window.apps = {
        'help': new AppData('help', 'Help', '/builtin/apps/help.html', false),
        'info': new AppData('info', 'About', '/builtin/apps/about.html', false, { width: '300px', height: '500px', class: ['no-resize', 'no-max', 'no-full'] }),
        'settings': new AppData('settings', 'Settings', '/builtin/apps/settings.html', false),
        'browser': new AppData('browser', 'Browser', '/builtin/apps/browser.html', false),
        'applications-apps': new AppData('applications-apps', 'App Store', '/builtin/apps/apps.html', false),
        'search': new AppData('search', 'Search', config.settings.get('search').url || 'https://duckduckgo.com/', true),
        //'gamehub': new AppData('gamehub', 'Games', '/builtin/apps/games.html', false),
        ...config.apps.get(),
    }

    Flow.boot();
}

new SettingsCategory('search', 'Search', 
    new SettingsInput('url', 'Search Engine URL', 'https://duckduckgo.com', 'https://duckduckgo.com'),
);

new SettingsCategory('theme', 'Theme', 
    new SettingsInput('url', 'Theme URL', 'https://mysite.to/theme.css', '/builtin/themes/catppuccin.css'),
);

new SettingsCategory('modules', 'Modules/Scripts', 
    new SettingsTextarea('urls', 'Module URLs', 'https://mysite.to/script1.js\nhttps://mysite.to/script2.js\nhttps://mysite.to/script3.js', '/builtin/modules/battery.js\n/builtin/modules/clock.js\n/builtin/modules/weather.js'),
);