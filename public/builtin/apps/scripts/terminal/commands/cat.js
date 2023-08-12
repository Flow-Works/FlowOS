export const metadata = {
    cmd: 'cat',
    description: 'Concatenate FILE(s) to standard output.'
};

export const exec = (fs, term, usr, dir, args) => {
    let path;
    if (!args[1]) { return ''; };

    if (path !== '/' && args[1].startsWith('/')) {
        path = args[1];
    } else if (path !== '/') {
        if (fs.realpathSync(dir.path) == '/') { path = '/' + args[1]; }
        else { path = fs.realpathSync(dir.path) + '/' + args[1]; }
    };

    return fs.readFileSync(path).toString().split('\n');
};