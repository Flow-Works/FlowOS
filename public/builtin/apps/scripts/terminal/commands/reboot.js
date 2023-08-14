export const metadata = {
    cmd: 'reboot',
    description: 'Reboot the OS'
};

export const exec = (fs, term, usr, dir, args) => {
    parent.window.location.reload();
    return "Rebooting..."
};