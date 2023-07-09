const searchEngine = window.localStorage.getItem('search');

const apps = {
    ...JSON.parse(window.localStorage.getItem('apps')),
    'info': new AppData('info', 'About', '/builtin/apps/about.html', false, { width: '300px', height: '500px' }),
    'applications-apps': new AppData('applications-apps', 'App Store', '/builtin/apps/settings.html', false),
    'settings': new AppData('settings', 'Settings', '/builtin/apps/settings.html', false, { width: '300px', height: '500px' }),
    'search': new AppData('search', 'Search', searchEngine, true),
}

const Flow = new FlowInstance();

window.onload = () => {
    Flow.boot();
}

const spotlight = new BarItem('spotlight', Flow.spotlight.toggle);

spotlight.setText('🔎')