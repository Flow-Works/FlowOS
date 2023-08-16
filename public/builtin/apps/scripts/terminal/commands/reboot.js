/* eslint-env browser */

export const metadata = {
    cmd: 'reboot',
    description: 'Reboot the OS'
};

export const exec = () => {
    parent.window.location.reload();
    return 'Rebooting...';
};