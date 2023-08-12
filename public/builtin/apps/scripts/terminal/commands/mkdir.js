export const metadata = {
    cmd: 'mkdir',
    description: 'Create the DIRECTORY(ies), if they do not already exist.'
};

export const exec = (fs, term, usr, dir, args) => {
    if (!args[1].startsWith('/')) fs.mkdirSync(dir.path + '/' + args[1]);
    else fs.mkdirSync(dir.path + args[1]);
};