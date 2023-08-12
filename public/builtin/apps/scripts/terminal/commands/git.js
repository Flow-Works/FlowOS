/* eslint-env browser */

import git from 'https://cdn.jsdelivr.net/npm/isomorphic-git@1.24.5/+esm';
import http from 'https://unpkg.com/isomorphic-git/http/web/index.js';

export const metadata = {
    cmd: 'git',
    description: 'List information about the FILEs (the current directory by default).'
};

export const exec = async (fs, term, usr, dir, args) => {
    const options = args.map(arg => {
        if (arg.startsWith('--') && arg.includes('=') == false) return arg;
        if (arg.startsWith('-') && arg.includes('=') == false) return arg;
    }).filter((element) => element !== undefined);

    const vars = {};
    
    args.forEach((arg) => {
        if (arg.startsWith('--') && arg.includes('=')) { 
            vars[arg.split('=')[0].replace('--', '')] = arg.split('=')[1];
        };
    });

    args.shift();
    const values = args.map(arg => {
        if (!arg.startsWith('-')) return arg;
    }).filter((element) => element !== undefined);

    console.log(options, values, vars);

    return new Promise(async (resolve) => {
        if (values[0] == 'clone') {
            let cfg = {
                quiet: false,
                depth: 1,
                noCheckout: false,
                noTags: false,
                singleBranch: true,
            };

            if (options.includes('-q') || options.includes('--quiet')) cfg.quiet = true;
            if (options.includes('-n') || options.includes('--no-checkout')) cfg.noCheckout = true;
            if (options.includes('--no-tags')) cfg.noTags = true;
            if (options.includes('--single-branch')) cfg.singleBranch = true;
            if (options.includes('--no-single-branch')) cfg.singleBranch = false;

            if (vars['depth']) cfg.depth = vars['depth'];
            if (vars['shallow-since']) cfg.since = new Date(vars['shallow-since']);
            if (vars['shallow-exclude']) cfg.exclude = vars['shallow-exclude'];

            if (cfg.quiet !== true) term.writeln(`Cloning into '${values[1].split(/(\\|\/)/g).pop()}'...`);

            await git.clone({
                fs,
                http,
                dir: values[2] ?? dir.path + '/' + values[1].split(/(\\|\/)/g).pop(),
                corsProxy: 'https://cors.isomorphic-git.org',
                url: values[1],
                noCheckout: cfg.noCheckout,
                singleBranch: cfg.singleBranch,
                depth: cfg.depth,
                noTags: cfg.noTags,
                since: cfg.since,
                exclude: cfg.exclude,
                onMessage: (e) => {
                    if (cfg.quiet !== true) term.writeln(e);
                },
            });
            resolve('');
        } else if (values[0] == 'init') {
            let cfg = {
                quiet: false,
                bare: false,
                defaultBranch: 'master',
            };

            if (options.includes('-q') || options.includes('--quiet')) cfg.quiet = true;
            if (options.includes('--bare')) cfg.bare = true;

            if (vars['initial-branch']) cfg.defaultBranch = vars['initial-branch'];
            if (vars['separate-git-dir']) cfg.gitdir = vars['separate-git-dir'];

            await git.init({
                fs,
                http,
                dir: values[1] ?? dir.path,
                bare: cfg.bare,
                defaultBranch: cfg.defaultBranch,
                gitdir: cfg.gitdir
            });

            if (cfg.quiet !== true) term.writeln(`Initialized empty Git repository in ${fs.realpathSync(values[1]) ?? dir.path}/.git/`);

            resolve('');
        } else {
            if (options[0] == '--version') {
                resolve('git version ' + git.version());
            } else if (options[0] == '--help') {
                resolve([
                    `usage: git [--version] [--help] <command> [<args>]`,
                    ``,
                    `These are common Git commands used in various situations:`,
                    ``,
                    `start a working area`,
                    `   clone     Clone a repository into a new directory`,
                    `   init      Create an empty Git repository or reinitialize an existing one`
                ]);
            }
        }
    });
};