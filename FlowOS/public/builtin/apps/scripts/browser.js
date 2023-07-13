let id = 0;

const targetObj = {
	active: {
		iframe: null,
		id: null
	}
};

let history = [];
const targetProxy = new Proxy(targetObj, {
	set: (target, key, value) => {
		history = [value.id].concat(history);

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

		const div = document.createElement('div');

		const a = document.createElement('a');
		a.id = id;
		a.innerText = 'Loading... ';
		a.href = '#';

		const a2 = document.createElement('a');
		a2.innerText = '[x]';
		a2.href = '#';

		div.appendChild(a);
		div.appendChild(a2);

		const iframe = document.createElement('iframe');
		iframe.src = parent.__uv$config.prefix + parent.__uv$config.encodeUrl(parent.config.settings.get('search').url);
		iframe.id = id;
		iframe.onload = () => {
			parent.config.settings.get('search').urls.forEach((url) => {
				injectJS(frames[id - 1], url, false, () => {});
			});

			let open = false;
			injectJS(frames[id - 1], 'https://cdn.jsdelivr.net/npm/eruda', false, () => {
				frames[id - 1].window.eruda.init({
					tool: ['console', 'elements', 'code', 'block']
				});
				frames[id - 1].window.eruda._entryBtn.hide();
				injectJS(frames[id - 1], 'https://cdn.jsdelivr.net/npm/eruda-code', false, () => {
					frames[id - 1].window.eruda.add(frames[id - 1].window.erudaCode);
				});
				document.querySelector('.owo').onclick = () => {
					if (open == false) {
						frames[id - 1].window.eruda.show();
					} else {
						frames[id - 1].window.eruda.hide();
					}
	
					open = !open;
				};
			});
			document.querySelector('.delete').onclick = () => {
				blockElement(frames[id - 1]);
			};
			a.innerText = `${iframe.contentDocument.title} `;
		};

		a.onclick = () => {
			targetProxy.active = {
				iframe,
				id
			};
		};

		a2.onclick = () => {
			iframe.remove();
			div.remove();
			const it = history[1];
			if (id !== it) {
				targetProxy.active = {
					iframe: document.querySelector(`iframe[id="${
						it
					}"]`),
					id: it
				};
			}
		};

		targetProxy.active = {
			iframe,
			id
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

const injectJS = (iframe, FILE_URL, async = true, callback) => {
	const scriptEle = document.createElement('script');

	scriptEle.setAttribute('src', FILE_URL);
	scriptEle.setAttribute('type', 'text/javascript');
	scriptEle.setAttribute('async', async);

	iframe.document.head.appendChild(scriptEle);
	
	scriptEle.addEventListener('load', () => {
		callback();
	});
};

const blockElement = (iframe) => {
	for (const element of iframe.document.getElementsByTagName('a')) {
		(element).style.pointerEvents = 'none';
	}
	
	const handler = (e) => {
		e = e || window.event;
		const target = e.target || e.srcElement;
		target.style.display = 'none';
		
		iframe.document.removeEventListener('click', handler, false);
		cursor('default');
		
		for (const element of iframe.document.getElementsByTagName('a')) {
			(element).style.pointerEvents = 'initial';
		}
	};
	
	iframe.document.addEventListener('click', handler, false);
	cursor('crosshair');
	const cursor = (cur) => { iframe.document.body.style.cursor = cur; };
};