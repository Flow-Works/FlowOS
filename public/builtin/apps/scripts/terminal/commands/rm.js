import parser from '../parser.js';

export const metadata = {
  cmd: 'rm',
  description: 'Remove (unlink) the FILE(s).'
};

const deleteFolderRecursive = (fs, directoryPath) => {
  if (fs.existsSync(directoryPath)) {
    fs.readdirSync(directoryPath).forEach((file) => {
      const curPath = `${directoryPath}/${file}`;
      if (fs.statSync(curPath).isDirectory()) {
        // recurse
        deleteFolderRecursive(fs, curPath);
      } else {
        // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(directoryPath);
  }
};

export const exec = ({ fs, dir, args, stdout }) => {
  const { options, values } = parser(args);

  let path;
  if (!values[0]) { return ''; }

  if (path !== '/' && values[0].startsWith('/')) {
    path = values[0];
  } else if (path !== '/') {
    path = fs.realpathSync(dir.path) === '/' ? `/${values[0]}` : `${fs.realpathSync(dir.path)}/${values[0]}`;
  }

  const cfg = {
    verbose: false,
    recursive: false
  };

  if (options.includes('-v')) cfg.verbose = true;
  if (options.includes('-r')) cfg.recursive = true;

  if (cfg.recursive === true) {
    try { fs.unlinkSync(values[0]); } catch (e) { deleteFolderRecursive(fs, path); }
  } else {
    fs.unlinkSync(values[0]);
  }

  stdout.close();
};
