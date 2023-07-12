let page = 1;
window.onload = () => {
	document.querySelector('#next').onclick = () => {
		page += 1;

		if (page == 3) document.querySelector('#next').innerText = "Finish"

		if (page == 4) {
			fetch('/gen?password=' + document.querySelector('input[type="password"]').value).then(res => res.text())
				.then(data => {
					config.setup.set(true);
					config.password.set(data);
					parent.window.location.href = parent.window.location.href;
				})
		} else {
			document.querySelector('.page' + (page - 1)).style.display = "none";
			document.querySelector('.page' + page).style.display = "block";
		}
	}

	document.querySelector('form').onsubmit = (e) => {
		e.preventDefault();
		page += 1;

		if (page == 3) document.querySelector('#next').innerText = "Finish"

		if (page == 4) {
			alert(document.querySelector('input[type="password"]').value);
		} else {
			document.querySelector('.page' + (page - 1)).style.display = "none";
			document.querySelector('.page' + page).style.display = "block";
		}
	}
}