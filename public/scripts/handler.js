/* eslint-env browser */

import WinBox from 'https://cdn.jsdelivr.net/npm/winbox@0.2.82/src/js/winbox.js';

window.onerror = (e) => {
  WinBox({
    title: 'Error',
    html:
            `<div class="err">${e.filename} at line ${e.lineno}: ${e.message}<style>.err { padding: 5px; }</style></div>`,
    x: 'center',
    y: 'center',
    width: '300px',
    height: '200px'
  });
};
