import { table } from 'https://cdn.jsdelivr.net/npm/table@6.8.1/+esm';
import c from 'https://cdn.jsdelivr.net/npm/ansi-colors@4.1.3/+esm';

const modeToString = (mode) => {
	if (mode.mode) mode = mode.mode; // handle fs.stat

	let result = new Buffer('drwxrwxrwx', 'ascii');

	if (!(mode & 0o40000)) result[0] = 45;

	for (let i = 1, bit = 0o400; bit; i++, bit >>= 1) {
		if (!(mode & bit)) result[i] = 45; // ASCII for '-'
	}

	return result.toString();
};

export const metadata = {
	cmd: 'ls',
	description:
		'List information about the FILEs (the current directory by default).',
};

export const exec = (fs, term, usr, dir, args) => {
    let realPath = fs.realpathSync(dir.path);

    let path;
    if (!args[1]) { path = realPath; };

    if (path !== realPath && args[1].startsWith('/')) {
        path = args[1];
    } else if (path !== realPath) {
        if (realPath == '/') { path = '/' + args[1]; }
        else { path = realPath + '/' + args[1]; }
    };

	const config = {
		singleLine: true,
		columns: [
			{ alignment: 'left' },
			{ alignment: 'left' },
			{ alignment: 'left' },
			{ alignment: 'left' },
			{ alignment: 'right' },
			{ alignment: 'left' },
			{ alignment: 'left' },
		],
	};

	const data = [];

    if (JSON.stringify(fs.readdirSync(path)) == '[]') return '';

	fs.readdirSync(path).forEach((name) => {
		const stat = fs.statSync(`${path}/${name}`);
		const date = new Intl.DateTimeFormat('en-US', {
			dateStyle: 'medium',
			timeStyle: 'short',
			hour12: false,
		})
			.format(stat.mtime)
			.replace(/\,/g, '')
			.replace(`${new Date().getFullYear()} `, '');

		if (stat.isFile()) {
            let icon;

            switch (name.split('.').pop()) {
                default:
                    icon = name.startsWith('.') ? '󰘓  ' : '󰈔  ';
                    break;
                case 'key':
                    icon = '󱆄  ';
                    break;
                case 'crt':
                    icon = '󱆆  ';
                    break;
                case 'txt':
                case 'text':
                    icon = '󰈙  ';
                    break;
                case 'jpg':
                case 'jpeg':
                case 'png':
                case 'gif':
                case 'webp':
                    icon = '󰈟  ';
                    break;

                case 'cjs':
                case 'mjs':
                case 'js':
                    icon = '󰌞  ';
                    break;
                case 'ts':
                    icon = '󰛦  ';
                    break;
                case 'jsonc':
                case 'json':
                    icon = '󰘦  ';
                    break;
                case 'md':
                    icon = '󰍔  ';
                    break;
                case 'css':
                    icon = '󰌜  ';
                    break;
                case 'py':
                    icon = '󰌠  ';
                    break;
                case 'html':
                    icon = '󰌝  ';
                    break;
                case 'lock':
                    icon = '󰌾  ';
                    break;
            }

			data.push([
				modeToString(stat.mode),
				stat.nlink,
				usr.username,
				'user',
				stat.size,
				date,
				name.startsWith('.') ? c.grey(icon + name) : icon + name,
			]);
        return;
		}
    if (stat.isDirectory()) {
    			data.push([
        modeToString(stat.mode),
        stat.nlink,
        usr.username,
        'user',
        stat.size,
        date,
        name.startsWith('.') ? c.grey('󱞞  ' + name) : '󰉖  ' + name,
    			]);
    		}
	});

	return table(data, config).split('\n');
};
