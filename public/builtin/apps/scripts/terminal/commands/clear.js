export const metadata = {
    cmd: 'echo',
    description: 'Write arguments to the standard output.'
};

export const exec = (fs, term) => {
    term.reset();
};