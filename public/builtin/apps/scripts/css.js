/* eslint-env browser */
/* global require monaco*/

import { config } from '../../../scripts/managers.js';

require.config({
	paths: {
		'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@0.8.3/min/vs'
	}
});
window.MonacoEnvironment = {
	getWorkerUrl: () => proxy
};

const proxy = URL.createObjectURL(new Blob([`
	self.MonacoEnvironment = {
		baseUrl: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.8.3/min/'
	};
	importScripts('https://cdn.jsdelivr.net/npm/monaco-editor@0.8.3/min/vs/base/worker/workerMain.js');
`], {
	type: 'text/javascript'
}));

require(['vs/editor/editor.main'], () => {
	const editor = monaco.editor.create(document.querySelector('.container'), {
		value: config.css.get(),
		language: 'css',
		theme: 'vs-dark'
	});

	editor.addListener('didType', () => {
		config.css.set(editor.getValue());
		parent.document.querySelector('[flow-style]').innerHTML = editor.getValue();
	});

	editor.addListener('didPaste', () => {
		config.css.set(editor.getValue());
		parent.document.querySelector('[flow-style]').innerHTML = editor.getValue();
	});
});