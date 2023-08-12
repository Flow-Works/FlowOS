export const metadata = {
    cmd: 'ls',
    description: 'List information about the FILEs (the current directory by default).'
};

export const exec = (fs, term, usr, dir) => {
    return fs.readdirSync(dir.path);
};