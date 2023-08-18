export const metadata = {
  cmd: 'clear',
  description: 'Clear the terminal'
};

export const exec = ({ term, stdout }) => {
  term.reset();
  stdout.close();
};
