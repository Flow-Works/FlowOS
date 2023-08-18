/* eslint-env browser */
/* global Terminal */

import 'https://cdn.jsdelivr.net/npm/xterm@5.2.1/lib/xterm.min.js';

import FitAddon from 'https://cdn.jsdelivr.net/npm/xterm-addon-fit@0.7.0/+esm';
import WebLinksAddon from 'https://cdn.jsdelivr.net/npm/xterm-addon-web-links@0.8.0/+esm';
import CanvasAddon from 'https://cdn.jsdelivr.net/npm/xterm-addon-canvas@0.4.0/+esm';
import FontFaceObserver from 'https://cdn.jsdelivr.net/npm/fontfaceobserver@2.3.0/+esm';

import { config } from '../../../../../../scripts/managers.js';

import { CommandsAddon } from './terminal/handler.js';

import { _auth } from '../../../scripts/firebase.js';
import * as auth from 'https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js';

const commands = {
  cd: './terminal/commands/cd.js'
};

window.loadCSS = (FILE_URL, callback) => {
  const styleEle = document.createElement('link');

  styleEle.setAttribute('rel', 'stylesheet');
  styleEle.setAttribute('type', 'text/css');
  styleEle.setAttribute('href', FILE_URL);

  document.head.appendChild(styleEle);

  styleEle.addEventListener('load', () => {
    if (typeof callback === 'function') callback();
  });
};

window.addEventListener('load', () => {
  window.loadCSS(config.settings.get('theme').url, () => {
    const term = new Terminal({
      cursorBlink: true,
      fontFamily: 'JetBrains Mono Nerd Font, monospace',
      fontSize: '15',
      lineHeight: '1.1',
      letterSpacing: '1.4',
      allowTransparency: true,
      theme: {
        background: getComputedStyle(
          document.querySelector(':root')
        ).getPropertyValue('--desktop-bg'),
        foreground: getComputedStyle(
          document.querySelector(':root')
        ).getPropertyValue('--text-color')
      }
    });

    auth.onAuthStateChanged(_auth, (user) => {
      if (!user) {
        return;
      }
      const dir = {
        path: '/',
        set: (str) => {
          dir.path = str;
        }
      };

      const username =
      _auth.currentUser.displayName !== null
        ? _auth.currentUser.displayName.toLowerCase().replaceAll(' ', '-')
        : 'guest';

      const usr = { username };

      const fitAddon = new FitAddon.FitAddon();

      term.loadAddon(fitAddon);
      term.loadAddon(new WebLinksAddon.WebLinksAddon());
      term.loadAddon(new CanvasAddon.CanvasAddon());
      term.loadAddon(new CommandsAddon({ commands }, usr, dir));

      const font = new FontFaceObserver('JetBrains Mono Nerd Font');

      font.load().then(function () {
        document.getElementById('terminal').innerText = '';
        term.open(document.getElementById('terminal'));
        fitAddon.fit();

        window.onresize = () => {
          fitAddon.fit();
        };
      });
    });
  });
});
