export const metadata = {
    cmd: 'cd',
    description: 'Change the shell working directory.'
};

export const exec = (fs, term, usr, dir, args) => {
    if (fs.existsSync(args[1] || '/')) {
        if (args[1]) {
            if (!args[1].startsWith('/')) dir.set('/' + args[1] || '/');
            else dir.set(args[1] || '/');
        } else {
            dir.set(args[1] || '/');
        }
    } else {
        return `-flush: cd: ${args[1] || '/'}: No such file or directory`;
    }
};