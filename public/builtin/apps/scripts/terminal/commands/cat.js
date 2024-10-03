export const metadata = {
  cmd: 'cat',
  description: 'Concatenate FILE(s) to standard output.'
};

export const exec = ({ fs, dir, args, stdout }) => {
  let path;
  if (!args[1]) { stdout.close(); }

  if (path !== '/' && args[1].startsWith('/')) {
    path = args[1];
  } else if (path !== '/') {
    path = fs.realpathSync(dir.path) === '/' ? `/${args[1]}` : `${fs.realpathSync(dir.path)}/${args[1]}`;
  }

  fs.readFileSync(path).toString().split('\n').forEach(ln => stdout.send(ln));
  stdout.close();
};
