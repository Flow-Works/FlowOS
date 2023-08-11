/* eslint-env browser */
/* global Terminal, FitAddon */

import 'https://cdn.jsdelivr.net/npm/xterm@5.2.1/lib/xterm.min.js';
import 'https://cdn.jsdelivr.net/npm/xterm-addon-fit@0.7.0/lib/xterm-addon-fit.min.js';

import { config } from '../../../scripts/managers.js';

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

let shellprompt = '\x1b[34m\x1b[0m\x1b[37;44m󰖟 thinl@thinliquid\x1b[0m\x1b[34;46m\x1b[0m\x1b[37;46m ~\x1b[0m\x1b[36m \x1b[0m';

term.prompt = () => {
	term.write('\r\n' + shellprompt);
};

term.writeln('Welcome to xterm.js');
term.writeln(
	'This is a local terminal emulation, without a real terminal in the back-end.'
);
term.writeln('Type some keys and commands to play around.');
term.prompt();

let current = '';

term.onKey(({ key, domEvent: ev }) => {
	let printable = !ev.altKey && !ev.altGraphKey && !ev.ctrlKey && !ev.metaKey
        && !ev.key.includes('Arrow');

	if (ev.keyCode == 13) {
        switch (current) {
            case 'neofetch':
                term.writeln('');
                const text = [
                    '7&#BBBBJ  G&:      7BBG#B~ 5#.~@J P#   \x1b[31mthinl\x1b[0m@\x1b[31mthinliquid\x1b[0m',
                    '7@Y   .   B@^     :&#. ^@B ?@^JBP #G   ----------------',
                    '7@B5555:  B@:     :@B  .&# ~@7P7B~@?   \x1b[32mOS\x1b[0m: FlowOS',
                    `7@P^~~~.  B@:     :@B  .&# .&PB.GY@~   \x1b[32mHost\x1b[0m: ${navigator.userAgent}`,
                    '7@Y       B@YJJJ?  G@Y75@Y  B@G Y@#.   \x1b[32mUptime\x1b[0m: 1 day, 18 hours, 12 mins',
                    ':7^       ~77???!   ~?J7^   ^7^ :7!    \x1b[32mPackages\x1b[0m: 0',
                    '   .^!7??7~:           :~7??7~^.       \x1b[32mShell\x1b[0m: bash 5.2.15',
                    ' ^5#@@@@@@@&B?.     :Y#@@@@@@@@&P~     \x1b[32mDE\x1b[0m: FlowOS',
                    '7@@@@#5YYG@@@@B.   ^&@@@&PYY5#@@@@J    \x1b[32mWM\x1b[0m: WinBox',
                    `&@@@&:    J@@@@J   5@@@@!    :5PPP5    \x1b[32mWM Theme\x1b[0m: ${config.settings.get('theme').url}`,
                    '@@@@B     !@@@@Y   J@@@@P^.',
                    '@@@@B     !@@@@Y   .P@@@@@&#GPJ!:',
                    '@@@@B     !@@@@Y     ~5#&@@@@@@@&5:',
                    '@@@@B     !@@@@Y        :~!?YB@@@@B.',
                    '@@@@B     !@@@@Y   ^~~~^      5@@@@7',
                    'B@@@@?:..^G@@@@!   B@@@@?:..:~B@@@&^',
                    ':P@@@@&&&@@@@&?    :G@@@@@&&&@@@@B!',
                    '  ~YB&@@@&#G?:       ~YG#@@@@&B5!.'
                ];
                text.forEach(ln => term.writeln(ln));
                break;
        }

        term.prompt();
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

    console.log(current);
});