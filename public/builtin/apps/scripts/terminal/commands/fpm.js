import parser from '../parser.js';

export const metadata = {
    cmd: 'fpm',
    description: 'fpm is a commandline package manager'
};

Object.defineProperty(Number.prototype,'fileSize',{value(a,b,c,d) {
    return (a=a?[1e3,'k','B']:[1024,'K','iB'],b=Math,c=b.log,
    d=c(this)/c(a[0])|0,this/b.pow(a[0],d)).toFixed(2)
    +' '+(d?(`${a[1]}MGTPEZY`)[--d]+a[2]:'Bytes');
},writable:false,enumerable:false});

export const exec = (fs, term, usr, dir, args) => {
    const { options, values } = parser(args);

    return new Promise(async (resolve, reject) => {
        const cfg = {
            quiet: false,
        };

        if (options.includes('-q') || options.includes('--quiet')) cfg.quiet = true;

        let then;
        let res;
        let text;

        switch (values[0]) {
            case 'install':
                then = new Date();
                res = await fetch(`https://cdn.jsdelivr.net/gh/Flow-Works/fpm@latest/${values[1]}.min.js`);

                text = await res.text();

                term.writeln(`Get:1 https://cdn.jsdelivr.net ${values[1]} [${(text.length * 2).fileSize(1)}]`);
                term.writeln(`Fetched ${(text.length * 2).fileSize(1)} in ${new Date() - then}ms`);

                if (fs.readFileSync(`/bin/${values[1]}.js`).toString() !== text) {
                    fs.writeFileSync(`/bin/${values[1]}.js`, text);
                    term.writeln(`Setting up ${values[1]} ...`);
                } else {
                    term.writeln(`${values[1]} is already the latest version.`);
                }

                resolve('');
                break;
            case 'reinstall':
                then = new Date();
                res = await fetch(`https://cdn.jsdelivr.net/gh/Flow-Works/fpm@latest/${values[1]}.min.js`);

                text = await res.text();

                term.writeln(`Get:1 https://cdn.jsdelivr.net ${values[1]} [${(text.length * 2).fileSize(1)}]`);
                term.writeln(`Fetched ${(text.length * 2).fileSize(1)} in ${new Date() - then}ms`);
                fs.writeFileSync(`/bin/${values[1]}.js`, text);
                term.writeln(`Setting up ${values[1]} ...`);
                resolve('');

                break;
            case 'remove':
                fs.unlinkSync(`/bin/${values[1]}.js`);
                term.writeln(`Removing ${values[1]} ...`);
                resolve('');

                break;
            case undefined:
                if (options.includes('-v') || options.includes('--version')) {
                    resolve('owo');
                } else if (options.includes('-h') || options.includes('--help')) {
                    resolve('www');
                } else {
                    resolve('nothing');
                }
                break;
            default:
                reject(new Error('balls'));
        }
    });
};