export const metadata = {
    cmd: 'clear',
    description: 'Clear the terminal'
};

export const exec = (fs, term) => {
    term.reset();
};