let page = 1;

const toBase64 = file => new Promise((resolve, reject) => {
	const reader = new FileReader();
	reader.readAsDataURL(file);
	reader.onload = () => resolve(reader.result);
	reader.onerror = reject;
});

function nextPage() {
	document.querySelector('.page' + page).style.display = 'none';
	document.querySelector('.page' + (page + 1)).style.display = 'block';
	page += 1;
}

function reboot() {
	fetch('/pwd/encrypt?password=' + document.querySelector('input[type="password"]').value).then(res => res.text())
		.then(async (data) => {
			config.setup.set(true);
			config.password.set(data);
			var file = document.querySelector('input[type="file"]').files[0];
			if (!file) {
				config.settings.set('profile', {
					url: '/assets/profile.png',
					username: document.querySelector('input[type="username"]').value
				});
			} else {
				config.settings.set('profile', {
					url: await toBase64(file),
					username: document.querySelector('input[type="username"]').value
				});
			}
			parent.window.location.href = parent.window.location.href;
		});
}

window.onload = () => {
	document.querySelectorAll('form')[0].onsubmit = (e) => {
		e.preventDefault();
		nextPage();
	};

	document.querySelectorAll('form')[1].onsubmit = (e) => {
		e.preventDefault();
		nextPage();
	};
};