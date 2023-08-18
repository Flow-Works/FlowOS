/* eslint-env browser */

const input = document.querySelector('input');

const proxyConfig = parent.currentProxy;

export class HistoryManager {
  constructor () {
    if (!window.localStorage.getItem('history')) { window.localStorage.setItem('history', '[]'); }
  }

  /**
   * Adds a URL to the history
   * @param {string} url
   * @param {string} title
   * @param {string} favicon
   * @returns {Array}
   */
  add = (url, title, favicon) => {
    return window.localStorage.setItem('history', JSON.stringify([{ url, title, favicon, date: new Date() }, ...this.get()]));
  };

  /**
   * Gets the history
   * @returns {Array}
   */
  get = () => JSON.parse(window.localStorage.getItem('history'));
}

export class TabManager {
  constructor () {
    document.querySelector('.tabs').addEventListener('wheel', (evt) => {
      evt.preventDefault();
      document.querySelector('.tabs').scrollLeft += evt.deltaY;
    });
  }

  /**
   * Sets the active tab
   * @param {HTMLIFrameElement} iframe
   * @returns {void}
   */
  setActiveTab = (iframe) => {
    window.clickList.push(iframe);

    if (!iframe && window.clickList[0] !== window.clickList[1]) {
      return;
    }

    try { input.value = proxyConfig.decodeUrl(new URL(iframe.contentWindow.location).pathname.replace(/\/uv\/service\//g, '')); } catch (e) {}
    iframe.style.display = 'block';
    if (window.clickList.length > 1) {
      window.clickList.at(-2).style.display = 'none';
    }
  };
}
