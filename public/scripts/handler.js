/* eslint-env browser */
/* global WinBox */

window.onerror = (e) => {
    new WinBox({
        title: 'Error',
        html:
            `<div class="err">${e.filename} at line ${e.lineno}: ${e.message}<style>.err { padding: 5px; }</style></div>`,
        x: 'center',
        y: 'center',
        width: '300px',
        height: '200px',
    });
};