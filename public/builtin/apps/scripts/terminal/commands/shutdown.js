/* eslint-env browser */

export const metadata = {
  cmd: 'shutdown',
  description: 'Shutdown the OS'
};

export const exec = ({ stdout }) => {
  parent.window.location.href = window.location.origin;
  stdout.send('Shutting Down...');
  stdout.close();
};
