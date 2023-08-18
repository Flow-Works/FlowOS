/* eslint-env browser */
/* global __uv$config, __dyn$config */

import { SettingsCategory, SettingsInput, SettingsTextarea, SettingsDropdown } from './classes.js';
import { config } from './managers.js';
import Logger from './logger.js';

const logger = new Logger();

export const registerSW = async () => {
  if ('serviceWorker' in navigator) {
    if (config.settings.get('search').proxy === 'Ultraviolet') {
      await navigator.serviceWorker.register('/uv/sw.js', {
        scope: __uv$config.prefix
      }).catch(() => window.logger.error('Failed to register UV serviceWorker.'));
    } else if (config.settings.get('search').proxy === 'Dynamic') {
      await navigator.serviceWorker.register('/dynamic/sw.js', {
        scope: __dyn$config.prefix
      }).catch(() => window.logger.error('Failed to register Dynamic serviceWorker.'));
    }
    return true;
  }
};

export const loadCSS = (FILE_URL) => {
  const startDate = new Date();
  const styleEle = document.createElement('link');

  styleEle.setAttribute('rel', 'stylesheet');
  styleEle.setAttribute('type', 'text/css');
  styleEle.setAttribute('href', FILE_URL);

  document.head.appendChild(styleEle);

  styleEle.addEventListener('load', () => {
    const nowDate = new Date();
    logger.debug(FILE_URL + ' - ' + Math.abs(startDate - nowDate) + 'ms');
    return true;
  });

  styleEle.addEventListener('error', (ev) => {
    logger.debug(FILE_URL, ev);
    return false;
  });
};

export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const registerSettings = () => {
  const search = new SettingsCategory('search', 'Browser', [
    new SettingsInput('url', 'Search Engine URL', 'https://duckduckgo.com', 'https://duckduckgo.com'),
    new SettingsTextarea('urls', 'Extension URLs', 'https://mysite.to/script1.js\nhttps://mysite.to/script2.js\nhttps://mysite.to/script3.js', ''),
    new SettingsDropdown('proxy', 'Proxy', 'Ultraviolet', ['Ultraviolet', 'Dynamic'])
  ]);

  const theme = new SettingsCategory('theme', 'Theme', [
    new SettingsInput('url', 'Theme URL', 'https://mysite.to/theme.css', '/builtin/themes/catppuccin-macchiato.css')
  ]);

  const modules = new SettingsCategory('modules', 'Modules/Scripts', [
    new SettingsTextarea('urls', 'Module URLs', 'https://mysite.to/script1.js\nhttps://mysite.to/script2.js\nhttps://mysite.to/script3.js', '/builtin/modules/battery.js\n/builtin/modules/clock.js\n/builtin/modules/weather.js')
  ]);

  return { search, theme, modules };
};

export const useCustomCSS = () => {
  const style = document.createElement('style');
  style.setAttribute('flow-style', 'true');
  style.innerHTML = config.css.get();
  document.head.append(style);
  return true;
};

export const removeObjectWithId = (arr, id) => {
  arr.splice(arr.findIndex((i) => {
    return i.id === id;
  }), 1);
};
