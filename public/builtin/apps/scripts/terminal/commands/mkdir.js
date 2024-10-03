export const metadata = {
  cmd: 'mkdir',
  description: 'Create the DIRECTORY(ies), if they do not already exist.'
};

export const exec = ({ fs, dir, args, stdout }) => {
  let path;

  if (path !== '/' && args[1].startsWith('/')) {
    path = args[1];
  } else if (path !== '/') {
    path = fs.realpathSync(dir.path) === '/' ? `/${args[1]}` : `${fs.realpathSync(dir.path)}/${args[1]}`;
  }

  fs.mkdirSync(path);
  stdout.close();
};
