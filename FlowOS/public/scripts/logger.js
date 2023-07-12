const regex = /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?\/[a-zA-Z0-9]{2,}|((https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?)|(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})?/g

function getBox(width, height) {
	return {
		string: "+",
		style: "font-size: 1px; padding: " + Math.floor(height / 10) + "px " + Math.floor(width / 2) + "px; line-height: " + height + "px;"
	}
}

class Logger {
	constructor() {}

	log(type, color, msg) {
		const logLines = (new Error().stack).split('\n');
		console.log(
			`%cFlowOS%c${type.toUpperCase()}%c ${msg}`,
			"padding:2.5px 10px;color:white;border-radius:10px;background:#363a4f;margin-right:5px;",
			`padding:2.5px 10px;color:white;border-radius:10px;background:${color};`,
			"padding:2.5px;"
		);
	}

	image(url, scale) {
		scale = scale || 1;
		var img = new Image();

		img.onload = function () {
			var dim = getBox(this.width * scale, this.height * scale);
			console.log("%c" + dim.string + "%c FlowOS\n " + Flow.version, dim.style + "background: url(" + url + "); background-repeat: no-repeat; background-size: " + (this.width * scale) + "px " + (this.height * scale) + "px; color: transparent;", '');
		};

		img.src = url;
	};

	info(msg) {
		this.log('info', '#8aadf4', msg);
	}

	error(msg) {
		this.log('error', '#ed8796', msg);

		new WinBox({
			title: 'Error',
			html: '<div class="err">' + msg + '<style>.err { padding: 5px; }</style></div>',
			x: 'center',
			y: 'center',
			width: '300px',
			height: '200px'
		})
	}

	success(msg) {
		this.log('success', '#a6da95', msg);
	}

	debug(msg) {
		this.log('debug', '#c6a0f6', msg);
	}
}