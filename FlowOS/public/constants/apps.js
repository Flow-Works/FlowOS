import { AppData } from '../scripts/classes.js';
import { config } from '../scripts/managers.js';

const apps = () => {
    return {
        'help': new AppData('help', 'Help', 'https://flowos-thinliquid.webapp-store.de/', '/assets/icons/help.svg', false),
        'info': new AppData('info', 'About', '/builtin/apps/about.html', '/assets/icons/info.svg', false, { width: '300px', height: '500px', class: ['no-resize', 'no-max', 'no-full'] }),
        'settings': new AppData('settings', 'Settings', '/builtin/apps/settings.html', '/assets/icons/settings.svg', false),
        'browser': new AppData('browser', 'Browser', '/builtin/apps/browser.html', '/assets/icons/browser.svg', false),
        'emulator': new AppData('emulator', 'Emulator', '/emu/', '/assets/icons/gameboy.svg', false),
        'app-store': new AppData('app-store', 'App Store', '/builtin/apps/apps.html', '/assets/icons/applications-apps.svg', false),
        'app-wizard': new AppData('app-wizard', 'Custom Application Wizard', '/builtin/apps/app-wizard.html', '/assets/icons/applications-programming.svg', false),
        ...config.apps.get(),
        ...config.customApps.get(),
    };
};

export default apps;