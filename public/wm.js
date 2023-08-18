/* eslint-env browser */

import WinBox from 'https://cdn.jsdelivr.net/npm/winbox@0.2.82/src/js/winbox.js';
import apps from './constants/apps.js';
import FlowSDK from './sdk/index.js';
import { config } from './scripts/managers.js';

export const windows = [];

export class WindowManager {
  /**
   * Opens an application
   * @param {string} APP_ID
   * @returns {void}
   */
  open = (APP_ID) => {
    const app = apps()[APP_ID];
    window.logger.debug(JSON.stringify(app));
    return new AppInstance({
      title: app.title,
      icon: app.icon,
      url: app.url,
      proxy: app.proxy,
      x: 'center',
      y: 'center',
      ...app.config
    });
  };

  createPopup = (type, title, content, callback = () => {}) => {
    const popup = new WinBox({
      title,
      class: ['no-min', 'no-max', 'no-full'],
      html: `
        <div style="display: flex;align-items: center;justify-content: center;height: 100%;">
          <div style="display: flex;gap: 10px;padding: 10px;">
            <img src="/assets/icons/${type}.svg" width="50px" style="position: sticky;top: 0;align-self: flex-start;">
            <p style="margin: 0;max-width: 230px;">${content}<br/></p>
          </div>
        </div>
      `,
      x: 'center',
      y: 'center',
      height: '200px',
      width: '350px'
    });

    const button = document.createElement('button');
    button.innerText = 'Ok';
    button.classList.add('btn');
    button.onclick = () => {
      popup.hide(true);
      callback();
    };
    popup.body.querySelector('div > div > p').append(button);
  };
}

class WindowInstance {
  constructor (options) {
    this.options = options;
    console.log(this.options);
  }

  createWindow = () => {
    this.instance = new WinBox({ ...this.options, root: document.querySelector('.container') });
    this.#addToTaskbar();
  };

  #addToTaskbar = () => {
    const taskbarItem = document.createElement('a');
    const taskbarImg = document.createElement('img');
    taskbarItem.classList.add('taskbar-item');
    taskbarItem.classList.add('new-item');
    taskbarImg.src = this.options.icon;
    taskbarImg.height = '18';

    taskbarItem.append(taskbarImg);
    taskbarItem.innerHTML += this.options.title;
    document.querySelector('.taskbar').append(taskbarItem);

    const _onclose = this.instance.onclose;
    this.instance.onclose = (force) => {
      taskbarItem.classList.add('remove-item');
      if (_onclose) _onclose(force);
      setTimeout(() => {
        taskbarItem.remove();
      }, 700);
    };

    taskbarItem.classList.add('focus');

    this.instance.onfocus = () => {
      taskbarItem.classList.add('focus');
    };

    this.instance.onblur = () => {
      taskbarItem.classList.remove('focus');
    };

    let open = true;
    this.instance.minimize(false);
    this.instance.focus();

    taskbarItem.onclick = () => {
      if (open === true) {
        this.instance.minimize(true);
        this.instance.blur();
      } else {
        this.instance.minimize(false);
        this.instance.focus();
      }

      open = !open;
    };
  };
}

/**
 * Loads CSS into the page
 * @param {string} FILE_URL
 * @param {HTMLDocument} doc
 * @returns {void}
 */
const loadCSS = (FILE_URL, doc) => {
  const styleEle = document.createElement('link');

  styleEle.setAttribute('rel', 'stylesheet');
  styleEle.setAttribute('type', 'text/css');
  styleEle.setAttribute('href', FILE_URL);

  doc.head.appendChild(styleEle);
};

export class AppInstance extends WindowInstance {
  constructor (appOptions) {
    super(appOptions);
    this.options.icon = appOptions.icon
      ? appOptions.icon
      : '/assets/icons/application.svg';
    this.options.proxy = appOptions.proxy || false;
    this.options.url = this.#useProxy(this.options.proxy, this.options.url);
    windows.push(this.instance);

    this.createWindow();

    if (this.options.proxy === true) {
      const iframe = this.instance.window.querySelector('iframe');

      iframe.onload = () => {
        const sdk = new FlowSDK(this.instance, this.options.url);
        iframe.contentWindow.FlowSDK = sdk;
        sdk.onmanifest = (manifest) => {
          if (manifest.uses.includes('theming')) loadCSS(config.settings.get('theme').url, iframe.contentDocument);
          if (manifest.uses.includes('styling')) {
            loadCSS('/styles/style.css', iframe.contentDocument);
            loadCSS('/styles/window.css', iframe.contentDocument);
          }
        };
      };
    }

    return this.instance;
  }

  /**
   * Decides whether to use proxy or not
   * @param {boolean} proxy
   * @param {string} url
   * @returns {string}
   */
  #useProxy = (proxy, url) => {
    if (proxy) { return self.currentProxy.prefix + self.currentProxy.encodeUrl(url); }
    return url;
  };
}

export class PopupInstance extends WindowInstance {
  constructor (type, title, content, callback = () => {}) {
    super({
      title,
      class: ['no-min', 'no-max', 'no-full'],
      html: `
        <div style="display: flex;align-items: center;justify-content: center;height: 100%;">
          <div style="display: flex;gap: 10px;padding: 10px;">
            <img src="/assets/icons/${type}.svg" width="50px" style="position: sticky;top: 0;align-self: flex-start;">
            <p style="margin: 0;max-width: 230px;">${content}<br/></p>
          </div>
        </div>
      `,
      x: 'center',
      y: 'center',
      height: '200px',
      width: '350px'
    });

    const button = document.createElement('button');
    button.innerText = 'Ok';
    button.classList.add('btn');
    button.onclick = () => {
      this.instance.hide(true);
      callback();
    };
    this.instance.body.querySelector('div > div > p').append(button);

    this.createWindow();

    return this.instance;
  }
}
