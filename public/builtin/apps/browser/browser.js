/* eslint-env browser */

import { config } from '../../../scripts/managers.js';
import { removeObjectWithId } from '../../../scripts/utilities.js';
import { TabManager, HistoryManager } from './managers.js';

const input = document.querySelector('input');

let id = 0;
const tabs = []; const proxyConfig = parent.currentProxy;
window.clickList = [];

const tm = new TabManager();
const history = new HistoryManager();

export class Tab {
  constructor () {
    id++;
    const _id = id;

    const div = document.createElement('div');
    const titleBtn = document.createElement('a');
    const closeBtn = document.createElement('a');
    const img = document.createElement('img');

    titleBtn.id = id;
    titleBtn.innerText = 'Loading... ';
    titleBtn.href = '#';

    closeBtn.innerText = '[x]';
    closeBtn.href = '#';

    img.width = '18';
    img.height = '18';
    img.src = '/assets/loading.gif';

    const iframe = this.#createIFrame(titleBtn, img);

    tabs.push({ iframe, id: _id });

    titleBtn.onclick = () => {
      tm.setActiveTab(iframe);
    };

    closeBtn.onclick = () => {
      iframe.remove();
      div.remove();

      removeObjectWithId(tabs, _id);

      if (tabs.includes(window.clickList.at(-1))) {
        tm.setActiveTab(window.clickList.at(-1));
      } else if (tabs.at(-1)) {
        tm.setActiveTab(tabs.at(-1));
      } else {
        return new Tab();
      }
    };

    div.appendChild(img);
    div.appendChild(titleBtn);
    div.appendChild(closeBtn);

    document.querySelector('.tabs').append(div);
    document.querySelector('main').append(iframe);

    tm.setActiveTab(iframe);
  }

  /**
   * Creates an iFrame for a tab
   * @param {HTMLAnchorElement} titleBtn
   * @param {HTMLImageElement} img
   * @returns {HTMLIFrameElement}
   */
  #createIFrame = (titleBtn, img) => {
    const iframe = document.createElement('iframe');
    iframe.src = proxyConfig.prefix + proxyConfig.encodeUrl(config.settings.get('search').url);
    iframe.id = id;
    iframe.onload = () => {
      this.#handleTab(iframe, titleBtn, img);
    };
    return iframe;
  };

  /**
    * Handles the iFrame onLoad event
    * @param {HTMLIFrameElement} tab
    * @param {HTMLAnchorElement} titleBtn
    * @param {HTMLImageElement} img
    * @returns {void}
    */
  #handleTab = (iframe, titleBtn, img) => {
    let open = false;
    const url = proxyConfig.decodeUrl(new URL(iframe.contentWindow.location).pathname.replace(new RegExp(`${proxyConfig.prefix.replaceAll('/', '\\/')}`, 'g'), ''));

    if (iframe.contentWindow.location.pathname.startsWith('/builtin/browser')) {
      input.value = 'flow://' + url.split('/').pop().split('.')[0];
    } else {
      input.value = url;
      history.add(iframe.contentWindow.location.href, iframe.contentDocument.title, `https://s2.googleusercontent.com/s2/favicons?domain_url=${url}`);
    }
    titleBtn.innerText = `${iframe.contentDocument.title} `;
    img.src = `https://s2.googleusercontent.com/s2/favicons?domain_url=${url}`;

    config.settings.get('search').urls.forEach((url) => {
      this.#injectJS(iframe, url, false, () => {});
    });

    this.#injectJS(iframe, 'https://cdn.jsdelivr.net/npm/eruda', true, () => {
      this.#injectJS(iframe, 'https://cdn.jsdelivr.net/npm/eruda-code', true, () => {
        iframe.contentWindow.eruda.add(iframe.contentWindow.erudaCode);
      });

      iframe.contentWindow.eruda.init({ tool: ['console', 'elements', 'code', 'sources'] });
      iframe.contentWindow.eruda._entryBtn.hide();

      document.querySelector('.eruda').onclick = () => {
        if (open === false) {
          iframe.contentWindow.eruda.show();
        } else {
          iframe.contentWindow.eruda.hide();
        }

        open = !open;
      };
    });

    document.querySelector('.block').onclick = () => {
      this.#blockElement(iframe);
    };
  };

  /**
    * Injects JS code into the iFrame
    * @param {HTMLIFrameElement} iframe
    * @param {string} FILE_URL
    * @param {boolean} async
    * @param {function} callback
    * @returns {Event}
    */
  #injectJS = (iframe, FILE_URL, async = true, callback) => {
    const scriptEle = document.createElement('script');

    scriptEle.setAttribute('src', FILE_URL);
    scriptEle.setAttribute('defer', async);

    iframe.contentDocument.body.appendChild(scriptEle);

    scriptEle.addEventListener('load', (e) => {
      callback(e);
    });

    scriptEle.addEventListener('error', (e) => {
      console.error(e, FILE_URL);
    });
  };

  /**
    * Injects the block element script into iFrame
    * @param {HTMLIFrameElement} iframe
    * @returns {void}
    */
  #blockElement = (iframe) => {
    const cursor = (cur) => { iframe.contentDocument.body.style.cursor = cur; };

    for (const element of iframe.contentDocument.getElementsByTagName('a')) {
      (element).style.pointerEvents = 'none';
    }

    const handler = (e) => {
      e = e || window.event;
      const target = e.target || e.srcElement;
      target.style.display = 'none';

      iframe.contentDocument.removeEventListener('click', handler, false);
      cursor('default');

      for (const element of iframe.contentDocument.getElementsByTagName('a')) {
        (element).style.pointerEvents = 'initial';
      }
    };

    iframe.contentDocument.addEventListener('click', handler, false);
    cursor('crosshair');
  };
}
