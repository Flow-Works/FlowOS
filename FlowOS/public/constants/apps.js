import { AppData } from '../scripts/classes.js';
import { config } from '../scripts/managers.js';

const apps = () => {
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

export default apps;