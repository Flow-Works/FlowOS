/* eslint-env browser */

export const metadata = {
  cmd: 'reboot',
  description: 'Reboot the OS'
};

export const exec = ({ stdout }) => {
  parent.window.location.reload();
  stdout.send('Rebooting...');
  stdout.close();
};
