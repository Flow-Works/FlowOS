export const metadata = {
    cmd: 'echo',
    description: 'Write arguments to the standard output.'
};

export const exec = (fs, term, usr, dir, args) => {
    if (!args[2] || !args[2].hasOwnProperty('op')) {
        return args[1];
    }
    if (args[2].op == '>') {
        fs.writeFileSync(args[3], args[1]);
    } else if (args[2].op == '>>') {
        fs.appendFileSync(args[3], `\n${args[1]}`);
    }
};