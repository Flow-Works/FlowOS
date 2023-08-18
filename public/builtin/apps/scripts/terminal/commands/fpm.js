import parser from '../parser.js';

export const metadata = {
  cmd: 'fpm',
  description: 'fpm is a commandline package manager'
};

const fileSize = (a, owo, b, c, d) => {
  const getSize = (a = a ? [1e3, 'k', 'B'] : [1024, 'K', 'iB'], b = Math, c = b.log,
  d = c(owo) / c(a[0]) | 0, owo / b.pow(a[0], d)).toFixed(2) +
    ' ' + (d ? (`${a[1]}MGTPEZY`)[--d] + a[2] : 'Bytes');
  return getSize;
};

const packageExists = (fs, pkgName, text) => fs.existsSync(`/bin/${pkgName}.js`) && fs.readFileSync(`/bin/${pkgName}.js`).toString() === text;

export const exec = async ({ fs, stdout, args }) => {
  const { vars, values } = parser(args);

  const repo = vars.repo ?? 'Flow-Works/fpm';
  const cdns = fs.readFileSync('/etc/fpm/cdnlist').toString().split('\n');

  const subCommands = {
    install: async () => {
      const then = new Date();

      const installer = async (resolve) => {
        for (const [index, cdn] of cdns.entries()) {
          const res = await fetch(cdn.replaceAll('$repo', repo).replaceAll('$file', `${values[1]}.js`));
          const text = await res.text();
          const status = res.status;

          stdout.send(`Get:${index + 1} ${new URL(cdn).origin} ${status} [${fileSize(1, (text.length * 2))}]`);

          if (status === 200) {
            stdout.send(`Fetched ${fileSize(1, (text.length * 2))} in ${new Date() - then}ms`);

            if (packageExists(fs, values[1], text)) {
              stdout.sendError(`${values[1]} is already the latest version.`);
            } else {
              fs.writeFileSync(`/bin/${values[1]}.js`, text);
              stdout.send(`Setting up ${values[1]} ...`);
            }

            stdout.close();
            break;
          }
        }
        resolve();
      };
      const installerEvent = new Promise(installer);

      installerEvent.then(() => {
        stdout.sendError(`Unable to locate package ${values[1]}`);
        stdout.close();
      }).catch();
    },
    reinstall: async () => {
      const then = new Date();

      const installer = async (resolve) => {
        for (const [index, cdn] of cdns.entries()) {
          const res = await fetch(cdn.replaceAll('$repo', repo).replaceAll('$file', `${values[1]}.js`)).catch();
          const status = res.status;
          const text = await res.text();

          stdout.send(`Get:${index + 1} ${new URL(cdn).origin} ${status} [${(text.length * 2).fileSize(1)}]`);

          if (status === 200) {
            stdout.send(`Fetched ${(text.length * 2).fileSize(1)} in ${new Date() - then}ms`);

            fs.writeFileSync(`/bin/${values[1]}.js`, text);
            stdout.send(`Setting up ${values[1]} ...`);
            stdout.close();

            break;
          }
        }
        resolve();
      };
      const installerEvent = new Promise(installer);

      installerEvent.then(() => {
        stdout.sendError(`Unable to locate package ${values[1]}`);
        stdout.close();
      });
    },
    remove: async () => {
      if (fs.existsSync(`/bin/${values[1]}.js`)) {
        fs.unlinkSync(`/bin/${values[1]}.js`);
        stdout.send(`Removing ${values[1]} ...`);
        stdout.close();
      }
      stdout.sendError(`Unable to locate package ${values[1]}`);
      stdout.close();
    }
  };

  await subCommands[`${values[0]}`]();
};
