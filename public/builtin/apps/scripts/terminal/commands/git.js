/* eslint-env browser */

import git from 'https://cdn.jsdelivr.net/npm/isomorphic-git@1.24.5/+esm';
import http from 'https://unpkg.com/isomorphic-git/http/web/index.js';

export const metadata = {
    cmd: 'git',
    description: 'List information about the FILEs (the current directory by default).'
};

export const exec = async (fs, term, usr, dir, args) => {
    if (args[1] == 'clone') {
        term.writeln(`Cloning into '${args[2].split(/(\\|\/)/g).pop()}'...`);
        await git.clone({
            fs,
            http,
            dir: dir.path + '/' + args[2].split(/(\\|\/)/g).pop(),
            corsProxy: 'https://cors.isomorphic-git.org',
            url: args[2],
            singleBranch: true,
            depth: 1
        });
        return 'Done!';
    }
};