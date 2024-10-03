import { table } from 'https://cdn.jsdelivr.net/npm/table@6.8.1/+esm';
import c from 'https://cdn.jsdelivr.net/npm/ansi-colors@4.1.3/+esm';

const modeToString = (mode) => {
  if (mode.mode) mode = mode.mode;

  const result = Buffer.from('drwxrwxrwx');

  if (!(mode & 0o40000)) result[0] = 45;

  for (let i = 1, bit = 0o400; bit; i++, bit >>= 1) {
    if (!(mode & bit)) result[i] = 45;
  }

  return result.toString();
};

export const metadata = {
  cmd: 'ls',
  description: 'List information about the FILEs (the current directory by default).'
};

export const exec = ({ fs, user, dir, args, stdout }) => {
  const realPath = fs.realpathSync(dir.path);

  let path;
  if (!args[1]) {
    path = realPath;
  }

  if (path !== realPath && args[1].startsWith('/')) {
    path = args[1];
  } else if (path !== realPath) {
    if (realPath === '/') {
      path = '/' + args[1];
    } else {
      path = realPath + '/' + args[1];
    }
  }

  const config = {
    singleLine: true,
    columns: [
      { alignment: 'left' },
      { alignment: 'left' },
      { alignment: 'left' },
      { alignment: 'left' },
      { alignment: 'right' },
      { alignment: 'left' },
      { alignment: 'left' }
    ]
  };

  const data = [];

  if (JSON.stringify(fs.readdirSync(path)) === '[]') stdout.close();

  fs.readdirSync(path).forEach((name) => {
    const stat = fs.statSync(`${path}/${name}`);
    const date = new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
      hour12: false
    })
      .format(stat.mtime)
      .replace(/,/g, '')
      .replace(`${new Date().getFullYear()} `, '');

    if (stat.isFile()) {
      let icon;

      switch (name.split('.').pop()) {
        case 'key':
          icon = '󱆄  ';
          break;
        case 'crt':
          icon = '󱆆  ';
          break;
        case 'txt':
        case 'text':
          icon = '󰈙  ';
          break;
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
        case 'webp':
          icon = '󰈟  ';
          break;

        case 'cjs':
        case 'mjs':
        case 'js':
          icon = '󰌞  ';
          break;
        case 'ts':
          icon = '󰛦  ';
          break;
        case 'jsonc':
        case 'json':
          icon = '󰘦  ';
          break;
        case 'md':
          icon = '󰍔  ';
          break;
        case 'css':
          icon = '󰌜  ';
          break;
        case 'py':
          icon = '󰌠  ';
          break;
        case 'html':
          icon = '󰌝  ';
          break;
        case 'lock':
          icon = '󰌾  ';
          break;
        case 'mp3':
        case 'ogg':
        case 'flac':
        case 'wav':
          icon = '󰈣  ';
          break;
        case 'mp4':
        case 'mkv':
        case 'webm':
        case 'mov':
        case 'avi':
          icon = '󰈫  ';
          break;
        case 'jar':
          icon = '󰬷  ';
          break;
        case 'exe':
          icon = '󰘔  ';
          break;
        case 'swf':
        case 'oops':
        case 'srm':
          icon = '󰺵  ';
          break;
        case 'zip':
          icon = '󰗄  ';
          break;
        case 'gitignore':
          icon = '󰊢  ';
          break;
        case 'cmd':
        case 'bash':
        case 'sh':
        case 'ps1':
        case 'bat':
        case 'vbs':
        case 'elf':
          icon = '󰲌  ';
          break;
        case 'env':
        case 'ini':
        case 'cfg':
        case 'conf':
          icon = '󱁻   ';
          break;
        case 'iso':
        case 'img':
          icon = '󰗮  ';
          break;
        case 'doc':
        case 'docx':
        case 'dot':
        case 'wbk':
        case 'docm':
        case 'dotx':
        case 'dotm':
        case 'docb':
          icon = '󰈬  ';
          break;
        case 'ppt':
        case 'pot':
        case 'pps':
        case 'ppa':
        case 'ppam':
        case 'pptm':
        case 'pptx':
        case 'potx':
        case 'ppsx':
        case 'ppsm':
        case 'sldx':
        case 'sldm':
        case 'pa':
          icon = '󰈧  ';
          break;
        case 'xls':
        case 'xlt':
        case 'xlm':
        case 'xlsx':
        case 'xlsm':
        case 'xltx':
        case 'xltm':
        case 'xlsb':
        case 'xla':
        case 'xlam':
        case 'xlw':
          icon = '󰈛  ';
          break;
        default:
          icon = name.startsWith('.') ? '󰘓  ' : '󰈔  ';
          break;
      }

      data.push([
        modeToString(stat.mode),
        stat.nlink,
        user.username,
        'user',
        stat.size,
        date,
        name.startsWith('.') ? c.grey(icon + name) : icon + name
      ]);
      return;
    }
    if (stat.isDirectory()) {
      data.push([
        modeToString(stat.mode),
        stat.nlink,
        user.username,
        'user',
        stat.size,
        date,
        name.startsWith('.') ? c.grey('󱞞  ' + name) : '󰉖  ' + name
      ]);
    }
  });

  table(data, config)
    .split('\n')
    .forEach((ln) => stdout.send(ln));
  stdout.close();
};
