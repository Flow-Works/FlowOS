/* eslint-env browser */

export const metadata = {
    cmd: 'shutdown',
    description: 'Shutdown the OS'
};

export const exec = () => {
    parent.window.location.href = window.location.origin;
    return 'Shutting Down...';
};