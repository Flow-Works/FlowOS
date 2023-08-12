export const metadata = {
    cmd: 'mkdir',
    description: 'Create the DIRECTORY(ies), if they do not already exist.'
};

export const exec = (fs, term, usr, dir, args) => {
    let path;

    if (path !== '/' && args[1].startsWith('/')) {
        path = args[1];
    } else if (path !== '/') {
        if (fs.realpathSync(dir.path) == '/') { path = '/' + args[1]; }
        else { path = fs.realpathSync(dir.path) + '/' + args[1]; }
    };

    fs.mkdirSync(path);
};