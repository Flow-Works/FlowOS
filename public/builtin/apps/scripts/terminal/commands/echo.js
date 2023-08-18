import parser from '../parser.js';

export const metadata = {
  cmd: 'echo',
  description: 'Write arguments to the standard output.'
};

export const exec = ({ args, stdout }) => {
  const { values } = parser(args);

  stdout.send(values.join(' '));
  stdout.close();
};
