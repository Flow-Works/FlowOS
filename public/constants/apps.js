import { AppData } from '../scripts/classes.js';
import { config } from '../scripts/managers.js';

const apps = () => {
    return {
        'help': new AppData('help', 'Help', 'https://docs.flow-works.me/', '/assets/icons/help.svg', false),
        'info': new AppData('info', 'About', '/builtin/apps/about.html', '/assets/icons/info.svg', false, { width: '300px', height: '500px', class: ['no-resize', 'no-max', 'no-full'] }),
        'settings': new AppData('settings', 'Settings', '/builtin/apps/settings.html', '/assets/icons/settings.svg', false),
        'browser': new AppData('browser', 'Browser', '/builtin/apps/browser/index.html', '/assets/icons/browser.svg', false),
        'emulator': new AppData('emulator', 'Emulator', '/builtin/apps/emulator/index.html', '/assets/icons/gameboy.svg', false),
        'app-store': new AppData('app-store', 'App Store', '/builtin/apps/apps.html', '/assets/icons/applications-apps.svg', false),
        'app-wizard': new AppData('app-wizard', 'Custom Application Wizard', '/builtin/apps/app-wizard.html', '/assets/icons/appeditor.svg', false),
        'flowgpt': new AppData('flowgpt', 'FlowGPT', '/builtin/apps/flowgpt.html', '/assets/icons/chat.svg', false),
        ...config.apps.get(),
        ...config.customApps.get(),
    };
};

export default apps;