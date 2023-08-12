/* eslint-env browser */
/* global Terminal */

import 'https://cdn.jsdelivr.net/npm/xterm@5.2.1/lib/xterm.min.js';

import FitAddon from 'https://cdn.jsdelivr.net/npm/xterm-addon-fit@0.7.0/+esm';
import WebLinksAddon from 'https://cdn.jsdelivr.net/npm/xterm-addon-web-links@0.8.0/+esm';

import { CommandsAddon } from './terminal/handler.js';

import { _auth } from '../../../scripts/firebase.js';
import * as auth from 'https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js';

const commands = {
    'cd': './terminal/commands/cd.js'
};

const term = new Terminal({
	cursorBlink: true,
    fontFamily: 'JetBrains Mono Nerd Font, monospace',
    letterSpacing: '1',
    allowTransparency: true
});

auth.onAuthStateChanged(_auth, (user) => {
    if (user) {
        let dir = { 
            path: '/',
            set: (str) => {
                dir.path = str;
            }
        };

        let username;
        if (_auth.currentUser.displayName !== null) username = _auth.currentUser.displayName.toLowerCase().replaceAll(' ', '-');
        else username = 'guest';
        
        const usr = { username };

        const fitAddon = new FitAddon.FitAddon();

        term.loadAddon(fitAddon);
        term.loadAddon(new WebLinksAddon.WebLinksAddon());
        term.loadAddon(new CommandsAddon({ commands }, usr, dir));

        term.open(document.getElementById('terminal'));
        fitAddon.fit();
    }
});