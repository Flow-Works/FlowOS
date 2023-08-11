/* eslint-env browser */
/* global Terminal, FitAddon */

import BrowserFS from 'https://cdn.jsdelivr.net/npm/browserfs@1.4.3/+esm';
import 'https://cdn.jsdelivr.net/npm/xterm@5.2.1/lib/xterm.min.js';
import 'https://cdn.jsdelivr.net/npm/xterm-addon-fit@0.7.0/lib/xterm-addon-fit.min.js';
import sh from 'https://cdn.jsdelivr.net/npm/shell-quote@1.8.1/+esm';
import c from 'https://cdn.jsdelivr.net/npm/ansi-colors@4.1.3/+esm';

import { _auth } from '../../../scripts/firebase.js';
import * as auth from 'https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js';

let terminalContainer = document.getElementById('terminal');

let term = new Terminal({
	cursorBlink: true,
    fontFamily: 'JetBrains Mono Nerd Font, monospace',
    letterSpacing: '1',
    allowTransparency: true
});
const fitAddon = new FitAddon.FitAddon();
term.loadAddon(fitAddon);

term.open(terminalContainer);

fitAddon.fit();

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
let promptMSG = () => `${c.blue('')}${c.bgBlue(` flow@${usr.username}`)}${c.bgCyan(c.blue('') + ` ${dir.path}`)}${c.cyan('')} `;

term.prompt = () => {
	term.write('\r' + promptMSG());
};

term.writeln('Welcome to FluSH!');
term.writeln('');
term.prompt();

let current = '';
// eslint-disable-next-line no-unused-vars
let fs;

BrowserFS.install(window);
BrowserFS.configure({
    fs: 'MountableFileSystem',
  	options: {
    	'/tmp': { fs: 'InMemory' },
        '/home': { fs: 'LocalStorage', options: { storeName: 'home' } }
  	}
}, (e) => {
	if (e) self.logger.error(e);
    
  	fs = require('fs');
});

term.onKey(({ key, domEvent: ev }) => {
	let printable = !ev.altKey && !ev.altGraphKey && !ev.ctrlKey && !ev.metaKey
        && !ev.key.includes('Arrow');

	if (ev.keyCode == 13) {
        if (current.length == 0) return;
        term.writeln('');
        const args = sh.parse(current);

        // eslint-disable-next-line no-unused-vars
        import('./terminal/' + args[0] + '.js').then((command) => {
            const cmd = eval(`command.exec(fs, term, usr, dir, args)`);
            if (cmd && !Array.isArray(cmd)) {
                term.writeln(cmd);
            } else if (Array.isArray(cmd)) {
                cmd.forEach(ln => term.writeln(ln));
            };
            term.prompt();
        }).catch((e) => {
            console.error(e);
            term.writeln(`${args[0]}: command not found`);
            term.prompt();
        });

        current = '';
	} else if (ev.keyCode == 8) {
		if (current.length > 0) {
            term.write('\b \b');
            current = current.slice(0, -1);
		}
	} else if (printable) {
        current += key;
		term.write(key);
	}
});
    }
});