/* eslint-env browser */

import { config } from '../../../scripts/managers.js';

window.onload = () => {
	document.querySelector('.profile').src = config.settings.get('profile').url;
	document.querySelector('h2').innerText = config.settings.get('profile').username;
	document.querySelector('form').onsubmit = (e) => {
		e.preventDefault();
		fetch(`/pwd/verify?hash=${config.password.get()}&input=${document.querySelector('input[type="password"]').value}`).then(res => res.text())
			.then(data => {
				if (data == 'true') {
					parent.loginWindow.close();
				} else if (data == 'false') {
					document.querySelector('sub').innerText = 'incorrect.';
				}
			});
	};
};