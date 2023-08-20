import { AppData } from '../scripts/classes.js';
import { config } from '../scripts/managers.js';

const apps = () => {
  return {
    help: new AppData('help', 'Help', 'https://docs.flow-works.me/docs/intro', '/assets/icons/help.svg', false),
    info: new AppData('info', 'About', '/builtin/apps/about.html', '/assets/icons/info.svg', false, { width: '300px', height: '500px', class: ['no-resize', 'no-max', 'no-full'] }),
    settings: new AppData('settings', 'Settings', '/builtin/apps/settings.html', '/assets/icons/settings.svg', false),
    browser: new AppData('browser', 'Browser', '/builtin/apps/browser/index.html', '/assets/icons/browser.svg', false),
    emulator: new AppData('emulator', 'Emulator', '/builtin/apps/emulator/index.html', '/assets/icons/gameboy.svg', false),
    marketplace: new AppData('marketplace', 'Marketplace', '/builtin/apps/apps.html', '/assets/icons/deepin-launcher.svg', false),
    'app-wizard': new AppData('app-wizard', 'Custom Application Wizard', '/builtin/apps/app-wizard.html', '/assets/icons/appeditor.svg', false),
    media: new AppData('media', 'Media Center', '/builtin/apps/media.html', '/assets/icons/playmyvideos.svg', false),
    terminal: new AppData('terminal', 'Terminal', '/builtin/apps/terminal.html', '/assets/icons/terminal.svg', false),
    ...config.apps.get(),
    ...config.customApps.get()
  };
};

export default apps;
