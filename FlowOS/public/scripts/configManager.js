/* eslint-env browser */

export default {
	css: {
		get: () => {
			return window.localStorage.getItem('css');
		},
		set: (value) => {
			return window.localStorage.setItem('css', value);
		},
	},
	password: {
		get: () => {
			return window.localStorage.getItem('password');
		},
		set: (value) => {
			return window.localStorage.setItem('password', value);
		},
	},
	apps: {
		get: () => {
			return JSON.parse(window.localStorage.getItem('apps'));
		},
		set: (value) => {
			return window.localStorage.setItem('apps', JSON.stringify(value));
		},
	},
	settings: {
		get: (item) => {
			return JSON.parse(window.localStorage.getItem(item));
		},
		set: (item, value) => {
			return window.localStorage.setItem(item, JSON.stringify(value));
		},
	}
};