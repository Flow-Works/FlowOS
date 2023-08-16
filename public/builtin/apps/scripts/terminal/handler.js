/* eslint-env browser */

import BrowserFS from 'https://cdn.jsdelivr.net/npm/browserfs@1.4.3/+esm';
import c from 'https://cdn.jsdelivr.net/npm/ansi-colors@4.1.3/+esm';
import sh from 'https://cdn.jsdelivr.net/npm/shell-quote@1.8.1/+esm';

const doimport = (str) => {
	if (URL.createObjectURL) {
		const blob = new Blob([str], { type: 'text/javascript' });
		const url = URL.createObjectURL(blob);
		const module = import(url);
		URL.revokeObjectURL(url); // GC objectURLs
		return module;
	}

	const url = `data:text/javascript;base64,${btoa(str)}`;
	return import(url);
};

export class CommandsAddon {
    _disposables = [];

    promptMSG = async () => {
        return await this.fs.readdirSync(this.dir.path).includes('.git') ? `${c.green('')}${c.bgGreen(` flow@${this.user.username}`)}${c.bgCyan(`${c.green('')} ${this.fs.realpathSync(this.dir.path)}`)}${c.bgBlue(c.cyan(' '))}${c.bgBlue(`󰓁 ${this.fs.readFileSync(`${this.dir.path}/.git/HEAD`).toString().replaceAll('\n', '').split('ref: refs/heads/')[1]}`)}${c.blue('')} ` : `${c.green('')}${c.bgGreen(` flow@${this.user.username}`)}${c.bgCyan(`${c.green('')} ${this.fs.realpathSync(this.dir.path)}`)}${c.cyan('')} `;
    };

    constructor(options, usr, dir) {
        this.commandsMap = options.commands;

        this.user = usr;
        this.dir = dir;

        this.current = '';

        BrowserFS.install(window);
    }

    activate(term) {
        this.terminal = term;

        this.#createFS();

        this.#handleClipboard();
        this.#handleInput();
    }

    #createFS = () => {
        BrowserFS.configure({
            fs: 'AsyncMirror',
            options: {
                sync: { fs: 'InMemory' },
                async: { fs: 'IndexedDB',
                    options: {
                        storeName: 'root'
                    }
                }
            }
        }, async (e) => {
	        if (e) console.error(e);
    
  	        this.fs = require('fs');

            if (!this.fs.existsSync('media')) this.fs.mkdirSync('media');
            if (!this.fs.existsSync('bin')) this.fs.mkdirSync('bin');
            
            this.terminal.prompt = async () => {
                this.terminal.write(`\r${await this.promptMSG()}`);
            };
            
            this.terminal.writeln('Welcome to FluSH!');
            this.terminal.writeln('');
            this.terminal.prompt();
        });
    };

    #handleInput = () => {
        this.terminal.onKey(({ key, domEvent: ev }) => {
            const printable = !ev.altKey && !ev.altGraphKey && !ev.ctrlKey && !ev.metaKey
                && !ev.key.includes('Arrow');
        
            if (ev.keyCode == 13) {
                if (this.current.length == 0) return;
                this.terminal.writeln('');
                const args = sh.parse(this.current);
                const _args = [...args];           

                this.#handleCommand(args, _args);
        
                this.current = '';
                return;
            }
            if (ev.keyCode == 8) {
                if (this.current.length > 0) {
                    this.terminal.write('\b \b');
                    this.current = this.current.slice(0, -1);
                }
            } else if (printable) {
                this.current += key;
                this.terminal.write(key);
            }
        });
    };

    #handleClipboard = () => {
        this.terminal.attachCustomKeyEventHandler(async (key) => {
            if (key.code === 'KeyV' && key.ctrlKey && key.type === 'keydown') {
                this.terminal.write(await navigator.clipboard.readText());
                this.current += await navigator.clipboard.readText();
                return false;
            }
        
            if (key.code === 'KeyC' && key.ctrlKey && key.type === 'keydown') {
                const selection = this.terminal.getSelection();
                if (selection) {
                    await navigator.clipboard.writeText(selection);
                    return false;
                }
            }
        
            return true;
        });
    };

    #handleCommand = (args, _args) => {
        import(`./commands/${args[0]}.js`)
            .then(async (command) => this.#runCommand(command, _args))
            .catch((e) => {
                try {
                    doimport(this.fs.readFileSync(`/bin/${args[0]}.js`))
                        .then(async (command) => this.#runCommand(command, _args))
                        .catch(this.#handleError);
                } catch {
                    this.#handleError(e);
                }
            });
    };

    #runCommand = async (command, _args) => {
        const cmd = await command.exec(this.fs, this.terminal, this.user, this.dir, _args);
        if (cmd && !Array.isArray(cmd)) {
            this.terminal.writeln(cmd);
        } else if (Array.isArray(cmd)) {
            cmd.forEach(ln => this.terminal.writeln(ln));
        };
        this.terminal.prompt();
    };

    #handleError = async (e) => {
        console.error(e);
        this.terminal.writeln(c.red(e.message ?? e));
        this.terminal.prompt();
    };
}