export const metadata = {
  cmd: 'config',
  description: ''
};

export const exec = ({ term, stdout }) => {
  term.reset();
  stdout.close();
};
