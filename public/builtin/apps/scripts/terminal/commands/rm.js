import parser from '../parser.js';

export const metadata = {
	cmd: 'rm',
	description: 'Remove (unlink) the FILE(s).',
};

const deleteFolderRecursive = (fs, directoryPath) => {
    if (fs.existsSync(directoryPath)) {
        fs.readdirSync(directoryPath).forEach((file) => {
            const curPath = `${directoryPath}/${file}`;
            if (fs.statSync(curPath).isDirectory()) {
                // recurse
                deleteFolderRecursive(fs, curPath);
            } else {
                // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(directoryPath);
    }
};

export const exec = (fs, term, usr, dir, args) => {
	const { options, values } = parser(args);

	const cfg = {
		verbose: false,
		recursive: false,
	};

	if (options.includes('-v')) cfg.verbose = true;
	if (options.includes('-r')) cfg.recursive = true;

	if (cfg.recursive == true) {
		try { fs.unlinkSync(values[0]); } catch (e) { deleteFolderRecursive(fs, values[0]); }
	} else {
		fs.unlinkSync(values[0]);
	}
};
