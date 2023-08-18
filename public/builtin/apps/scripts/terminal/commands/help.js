/* eslint-env browser */

import parser from '../parser.js';

export const metadata = {
  cmd: 'help',
  description: 'View what different commands do.'
};

const doimport = (str) => {
  if (URL.createObjectURL) {
    const blob = new Blob([str], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const module = import(url);
    URL.revokeObjectURL(url); // GC objectURLs
    return module;
  }

  const url = 'data:text/javascript;base64,' + btoa(str);
  return import(url);
};

export const exec = async ({ fs, args, stdout }) => {
  const { values } = parser(args);

  import(`./${values[0]}.js`)
    .then(async (command) => {
      const meta = command.metadata;
      stdout.send(`${meta.cmd}: ${meta.description}`.split('\n'));
      stdout.close();
    })
    .catch((e) => {
      try {
        doimport(fs.readFileSync(`/bin/${values[0]}.js`))
          .then((command) => {
            const meta = command.metadata;
            stdout.send(`${meta.cmd}: ${meta.description}`.split('\n'));
            stdout.close();
          })
          .catch((e) => {
            stdout.sendError(e);
            stdout.close();
          });
      } catch {
        stdout.sendError(e);
        stdout.close();
      }
    });
};
