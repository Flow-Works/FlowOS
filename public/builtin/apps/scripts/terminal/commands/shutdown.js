export const metadata = {
    cmd: 'shutdown',
    description: 'Shutdown the OS'
};

export const exec = (fs, term, usr, dir, args) => {
    parent.window.location.href=window.location.origin();
    return "Shutting Down..."
};