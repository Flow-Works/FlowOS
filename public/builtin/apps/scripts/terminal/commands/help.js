/* eslint-env browser */

import parser from '../parser.js';

export const metadata = {
	cmd: 'help',
	description: 'View what different commands do.',
};

const doimport = (str) => {
	if (URL.createObjectURL) {
		const blob = new Blob([str], { type: 'text/javascript' });
		const url = URL.createObjectURL(blob);
		const module = import(url);
		URL.revokeObjectURL(url); // GC objectURLs
		return module;
	}

	const url = 'data:text/javascript;base64,' + btoa(str);
	return import(url);
};

export const exec = async (fs, term, usr, dir, args) => {
	const { values } = parser(args);

	return new Promise((resolve, reject) => {
		import(`./${values[0]}.js`)
			.then(async (command) => {
				const meta = command.metadata;
				resolve(`${meta.cmd}: ${meta.description}`.split('\n'));
			})
			.catch((e) => {
				try {
					doimport(fs.readFileSync(`/bin/${values[0]}.js`))
						.then((command) => {
							const meta = command.metadata;
							resolve(`${meta.cmd}: ${meta.description}`.split('\n'));
						})
						.catch((e) => {
							console.error(e);
							reject(e);
						});
				} catch {
					console.error(e);
					reject(e);
				}
			});
	});
};
