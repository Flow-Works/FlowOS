export const metadata = {
    cmd: 'cat',
    description: 'Concatenate FILE(s) to standard output.'
};

export const exec = (fs, term, usr, dir, args) => {
    if (fs.existsSync(args[1])) {
        const content = fs.readFileSync(args[1]).split('\n');
        return content.toString().split('\n');
    } else if (fs.existsSync(dir.path + '/' + args[1])) {
        const content = fs.readFileSync(dir.path + '/' + args[1]);
        return content.toString().split('\n');
    } else {
        return `cat: ${args[1] || '/'}: No such file or directory`;
    };
};