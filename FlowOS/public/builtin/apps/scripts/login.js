window.onload = () => {
	document.querySelector('form').onsubmit = (e) => {
		e.preventDefault();
		fetch('/verify?aes=' + config.password.get() + '&input=' + document.querySelector('input[type="password"]').value).then(res => res.text())
			.then(data => {
				if (data == "true") {
					parent.loginWindow.close();
				} else if (data == "false") {
					document.querySelector('sub').innerText = 'incorrect.'
				}
			})
	}
}