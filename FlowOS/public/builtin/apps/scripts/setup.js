/* eslint-env browser */

import * as auth from 'https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js';

import { _auth } from '../../../scripts/firebase.js';

const loginForm = document.getElementById('login');
const signupForm = document.getElementById('signup');

const loginContainer = document.querySelector('.login');
const signupContainer = document.querySelector('.signup');

let page = 1;

window.nextPage = () => {
	document.querySelector(`.page${page}`).style.display = 'none';
	document.querySelector(`.page${page + 1}`).style.display = 'block';
	page++;
};

window.switchType = () => {
	if (signupContainer.style.display === 'none') {
		signupContainer.style.display = 'block';
		loginContainer.style.display = 'none';
	} else {
		loginContainer.style.display = 'block';
		signupContainer.style.display = 'none';
	}
};

window.forgotPassword = async () => {
	if (loginForm.elements.email.value && loginForm.elements.email.value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/s)) {
		await auth.sendPasswordResetEmail(_auth, loginForm.elements.email.value)
			.catch((error) => handleAuthError(error, 0));
		document.querySelectorAll('sub')[0].innerText = `Email sent to ${loginForm.elements.email.value}`;
	}
};

const handleAuthError = (error, subID) => {
	document.querySelectorAll('sub')[subID].innerText = error.message;
	console.error(error);
};

const handleAuthLogin = (user) => {
	document.querySelectorAll('sub')[0].innerText = `Logged in as ${user.displayName}`;
	window.nextPage();
};

const handleAuthSignup = (user, username) => {
	document.querySelectorAll('sub')[1].innerText = `Logged in as ${user.displayName}`;

	user.updateProfile({
  		displayName: username
	});

	window.nextPage();
};

window.reboot = () => {
	parent.window.location.href = parent.window.location.href;
};

window.onload = () => {
	loginForm.onsubmit = (e) => {
		e.preventDefault();
		handleForm(loginForm, 'login');
	};

	signupForm.onsubmit = (e) => {
		e.preventDefault();
		handleForm(signupForm, 'signup');
	};
};

const handleForm = async (form, type) => {
	switch (type) {
		case 'login':
			const login_data = await auth.signInWithEmailAndPassword(_auth, form.elements.email.value, form.elements.password.value)
				.catch((error) => handleAuthError(error, 0));
			handleAuthLogin(login_data.user);
			break;
		case 'signup':
			const signup_data = await auth.createUserWithEmailAndPassword(_auth, form.elements.email.value, form.elements.password.value)
				.catch((error) => handleAuthError(error, 1));
			handleAuthSignup(signup_data.user, form.elements.username.value);
			break;
	}
};

window.guest = async () => {
	await auth.signInAnonymously(_auth).catch((error) => {
		handleAuthError(error, 0);
		handleAuthError(error, 1);
	});
	window.reboot();
};