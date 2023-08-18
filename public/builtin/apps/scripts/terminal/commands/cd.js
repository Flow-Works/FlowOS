import parser from '../parser.js';

export const metadata = {
  cmd: 'cd',
  description: 'Change the shell working directory.'
};

export const exec = ({ fs, dir, args, stdout }) => {
  let path;
  const { values } = parser(args);
  if (!values[0]) { path = '/'; }

  if (!path) {
    if (values[0].startsWith('/')) {
      path = values[0];
    } else {
      path = fs.realpathSync(dir.path) === '/' ? `/${values[0]}` : `${dir.path}/${values[0]}`;
    }
  }

  fs.readdirSync(path);
  dir.set(path);

  stdout.close();
};
