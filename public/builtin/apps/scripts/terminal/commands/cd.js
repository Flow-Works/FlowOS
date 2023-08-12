export const metadata = {
    cmd: 'cd',
    description: 'Change the shell working directory.'
};

export const exec = (fs, term, usr, dir, args) => {
    let path;
    if (!args[1]) {  path = '/'; };

    if (path !== '/' && args[1].startsWith('/')) {
        path = args[1];
    } else if (path !== '/') {
        if (fs.realpathSync(dir.path) == '/') { path = '/' + args[1]; }
        else { path = fs.realpathSync(dir.path) + '/' + args[1]; }
    };

    fs.readdirSync(path);
    dir.set(path);

    return '';
};