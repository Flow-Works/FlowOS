let id = 0;

const targetObj = {
	active: {
		iframe: null,
		permID: null
	}
};

let history = [];
const targetProxy = new Proxy(targetObj, {
	set(target, key, value) {
		history = [value.permID].concat(history);

		if (history.length > 1 && history[0] !== history[1]) {
			try {
				value.iframe.style.display = 'block';
			} catch (e) {};
			try {
				document.querySelector(`iframe[id="${
                        history[1]
                    }"]`).style.display = 'none';
			} catch (e) {};
			target[key] = value;
		}
		return true;
	}
});

class Tab {
	constructor() {
		id++;
		const permID = id;

		const div = document.createElement('div');

		const a = document.createElement('a');
		a.id = permID;
		a.innerText = 'Loading... ';
		a.href = '#';

		const a2 = document.createElement('a');
		a2.innerText = '[x]';
		a2.href = '#';

		div.appendChild(a);
		div.appendChild(a2);

		const iframe = document.createElement('iframe');
		iframe.src = __uv$config.prefix + __uv$config.encodeUrl(config.settings.get('search').url);
		iframe.id = permID;
		iframe.onload = () => {
			config.settings.get('search').urls.forEach((url) => {
				injectJS(frames[permID - 1], url, false, () => {});
			});

			let open = false;
			injectJS(frames[permID - 1], 'https://cdn.jsdelivr.net/npm/eruda', false, () => {
				frames[permID - 1].window.eruda.init({
					tool: ['console', 'elements', 'code', 'block']
				});
				frames[permID - 1].window.eruda._entryBtn.hide();
				injectJS(frames[permID - 1], 'https://cdn.jsdelivr.net/npm/eruda-code', false, () => {
					frames[permID - 1].window.eruda.add(frames[permID - 1].window.erudaCode);
				});
				document.querySelector('.owo').onclick = () => {
					if (open == false) {
						frames[permID - 1].window.eruda.show();
					} else {
						frames[permID - 1].window.eruda.hide();
					}
	
					open = !open;
				};
			});
			document.querySelector('.delete').onclick = () => {
				deleter(frames[permID - 1]);
			};
			a.innerText = `${iframe.contentDocument.title} `;
		};

		a.onclick = () => {
			targetProxy.active = {
				iframe,
				permID
			};
		};

		a2.onclick = () => {
			iframe.remove();
			div.remove();
			const it = history[1];
			if (permID !== it) {
				targetProxy.active = {
					iframe: document.querySelector(`iframe[id="${
						it
					}"]`),
					permID: it
				};
			}
		};

		targetProxy.active = {
			iframe,
			permID
		};

		document.querySelector('.tabs').append(div);
		document.querySelector('main').append(iframe);
	}
}

window.onload = () => {
	new Tab();
	document.querySelector('.tabs').addEventListener('wheel', (evt) => {
    	evt.preventDefault();
    	document.querySelector('.tabs').scrollLeft += evt.deltaY;
	});
};

function injectJS(iframe, FILE_URL, async = true, callback) {
	const scriptEle = document.createElement('script');

	scriptEle.setAttribute('src', FILE_URL);
	scriptEle.setAttribute('type', 'text/javascript');
	scriptEle.setAttribute('async', async);

	iframe.document.head.appendChild(scriptEle);
	
	scriptEle.addEventListener('load', () => {
		callback();
	});
};

function deleter(iframe) {
	for (const element of iframe.document.getElementsByTagName('a')) {
		(element).style.pointerEvents = 'none';
	}
	
	function handler(e) {
		e = e || window.event;
		const target = e.target || e.srcElement;
		target.style.display = 'none';
		
		iframe.document.removeEventListener('click', handler, false);
		cursor('default');
		
		for (const element of iframe.document.getElementsByTagName('a')) {
			(element).style.pointerEvents = 'initial';
		}
	}
	
	iframe.document.addEventListener('click', handler, false);
	cursor('crosshair');
	function cursor(cur) { iframe.document.body.style.cursor = cur; }
}