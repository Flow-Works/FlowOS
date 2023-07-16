/* eslint-env browser */
/* global WinBox */

import 'https://cdn.jsdelivr.net/npm/winbox@0.2.82';

export default class Logger {
	constructor() {}

	log(type, color, msg) {
		console.log(
			`%cFlowOS%c${type.toUpperCase()}%c ${msg}`,
			'padding:2.5px 10px;color:white;border-radius:10px;background:#363a4f;margin-right:5px;',
			`padding:2.5px 10px;color:white;border-radius:10px;background:${color};`,
			'padding:2.5px;'
		);
	}

	info(msg) {
		this.log('info', '#8aadf4', msg);
	}

	error(msg) {
		this.log('error', '#ed8796', msg);

		new WinBox({
			title: 'Error',
			html: `<div class="err">${msg}<style>.err { padding: 5px; }</style></div>`,
			x: 'center',
			y: 'center',
			width: '300px',
			height: '200px'
		});
	}

	success(msg) {
		this.log('success', '#a6da95', msg);
	}

	debug(msg) {
		this.log('debug', '#c6a0f6', msg);
	}
}