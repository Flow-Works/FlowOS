/* eslint-env browser */

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js';
import * as auth from 'https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js';
import * as analytics from 'https://www.gstatic.com/firebasejs/10.0.0/firebase-analytics.js';

window.firebaseConfig = {
	apiKey: 'AIzaSyCVyXj1Z7l2Bbu51JGyhntNLI8iYaC-yus',
	authDomain: 'flow-os.firebaseapp.com',
	projectId: 'flow-os',
	storageBucket: 'flow-os.appspot.com',
	messagingSenderId: '1062493642028',
	appId: '1:1062493642028:web:3665c0b593f45342bee089',
	measurementId: 'G-3RNYBG5J74'
};

const app = initializeApp(window.firebaseConfig);
const _analytics = await analytics.getAnalytics(app);
const _auth = await auth.getAuth(app);

export { app, _auth, _analytics  };