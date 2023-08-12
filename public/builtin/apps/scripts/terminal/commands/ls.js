export const metadata = {
    cmd: 'ls',
    description: 'List information about the FILEs (the current directory by default).'
};

export const exec = (fs, term, usr, dir) => {
    console.log(fs.readdirSync(dir.path));
    return JSON.stringify(fs.readdirSync(dir.path));
};