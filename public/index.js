/* eslint-env browser */
/* global __uv$config __dyn$config */

import Logger from './scripts/logger.js';
import { registerSettings, useCustomCSS, sleep } from './scripts/utilities.js';
import { config } from './scripts/managers.js';

import FlowInstance from './flow.js';

import './uv/uv.config.js';
import './dynamic/dynamic.config.js';

window.immortalize = async () => {
  console.log('Loading 3MB Tailwind Package...');
  await sleep(500);
  console.log('Immortalizing OS...');
  await sleep(200);
  console.log('Rebooting...');
  await config.settings.set('theme', { url: '/builtin/themes/immortal.css' });
  await sleep(200);
  window.location.reload();
};

self.Flow = new FlowInstance();
self.logger = new Logger();

window.onload = () => {
  registerSettings();
  if (config.settings.get('search').proxy === 'Ultraviolet') {
    self.currentProxy = __uv$config;
  } else if (config.settings.get('search').proxy === 'Dynamic') {
    self.currentProxy = __dyn$config;
  }

  useCustomCSS();

  window.Flow.boot();
};

const searchBar = document.querySelector('.searchbar');
const appsList = document.querySelector('ul.apps');

searchBar.addEventListener('keyup', () => {
  const input = searchBar.value.toLowerCase();
  const apps = Array.from(appsList.children);

  apps.forEach((item) => {
    item.style.display = item.innerText.toLowerCase().includes(input) ? 'flex' : 'none';
  });
});
