/* eslint-env browser */

import c from 'https://cdn.jsdelivr.net/npm/ansi-colors@4.1.3/+esm';

export const metadata = {
    cmd: 'mkdir',
    description: 'Create the DIRECTORY(ies), if they do not already exist.'
};

const getVideoCardInfo = () => {
                const gl = document.createElement('canvas').getContext('webgl');
    if (!gl) {
      return {
        error: 'no webgl',
      };
    }
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    return debugInfo ? {
      vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
      renderer:  gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL),
    } : {
      error: 'no WEBGL_debug_renderer_info',
    };
};

export const exec = (fs, term, usr) => {
    return [
        ``,
        `7&#BBBBJ  G&:      7BBG#B~ 5#.~@J P#   ${c.blue(`flow`)}@${c.blue(usr.username)}`,
        `7@Y   .   B@^     :&#. ^@B ?@^JBP #G   ${`flow@${usr.username}`.split(``).map(() => `-`).join(``)}`,
        `7@B5555:  B@:     :@B  .&# ~@7P7B~@?   ${c.blue(`OS`)}: FlowOS`,
        `7@P^~~~.  B@:     :@B  .&# .&PB.GY@~   ${c.blue(`Host`)}: ${navigator.platform}`,
        `7@Y       B@YJJJ?  G@Y75@Y  B@G Y@#.   ${c.blue(`Packages`)}: 0`,
        `:7^       ~77???!   ~?J7^   ^7^ :7!    ${c.blue(`Shell`)}: flush 1.0.0`,
        `   .^!7??7~:           :~7??7~^.       ${c.blue(`DE`)}: FlowOS`,
        ` ^5#@@@@@@@&B?.     :Y#@@@@@@@@&P~     ${c.blue(`WM`)}: WinBox`,
        `7@@@@#5YYG@@@@B.   ^&@@@&PYY5#@@@@J    ${c.blue(`Terminal`)}: Terminal`,
        `&@@@&:    J@@@@J   5@@@@!    :5PPP5    ${c.blue(`GPU`)}: ${getVideoCardInfo().renderer}`,
        `@@@@B     !@@@@Y   J@@@@P^.            ${c.blue(`Memory`)}: ${Math.round(performance.memory.usedJSHeapSize / (1024 * 1024))}MiB / ${Math.round(performance.memory.jsHeapSizeLimit / (1024 * 1024))}MiB`,
        `@@@@B     !@@@@Y   .P@@@@@&#GPJ!:      `,
        `@@@@B     !@@@@Y     ~5#&@@@@@@@&5:    ${c.bgBlack(`   `)}${c.bgRed(`   `)}${c.bgGreen(`   `)}${c.bgBlack(`   `)}${c.bgYellow(`   `)}${c.bgBlue(`   `)}${c.bgMagenta(`   `)}${c.bgCyan(`   `)}${c.bgWhite(`   `)}`,
        `@@@@B     !@@@@Y        :~!?YB@@@@B.   ${c.bgBlackBright(`   `)}${c.bgRedBright(`   `)}${c.bgGreenBright(`   `)}${c.bgBlackBright(`   `)}${c.bgYellowBright(`   `)}${c.bgBlueBright(`   `)}${c.bgMagentaBright(`   `)}${c.bgCyanBright(`   `)}${c.bgWhiteBright(`   `)}`,
        `@@@@B     !@@@@Y   ^~~~^      5@@@@7`,
        `B@@@@?:..^G@@@@!   B@@@@?:..:~B@@@&^`,
        `:P@@@@&&&@@@@&?    :G@@@@@&&&@@@@B!`,
        `  ~YB&@@@&#G?:       ~YG#@@@@&B5!.`,
        ``
    ];
};