let id = 0;
let history = [];

const targetObj = {
	active: {
		iframe: null,
		id: null
	}
};

const targetProxy = new Proxy(targetObj, {
	set: (target, key, value) => {
		history = [value.id].concat(history);

		if (history.length > 1 && history[0] !== history[1]) {
			try {
				value.iframe.style.display = 'block';
			} catch (e) { };
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

		const iframeID = id - 1;

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

		const tab = document.createElement('iframe');
		tab.src = parent.__uv$config.prefix + parent.__uv$config.encodeUrl(parent.config.settings.get('search').url);
		tab.id = id;
		tab.onload = () => {
			a.innerText = `${tab.contentDocument.title} `;
			parent.config.settings.get('search').urls.forEach((url) => {
				injectJS(tab, url, false, () => {});
			});

			let open = false;
			injectJS(tab, 'https://cdn.jsdelivr.net/npm/eruda', false, () => {
				tab.contentWindow.eruda.init({
					tool: ['console', 'elements', 'code', 'block']
				});
				tab.contentWindow.eruda._entryBtn.hide();
				injectJS(tab, 'https://cdn.jsdelivr.net/npm/eruda-code', false, () => {
					tab.contentWindow.eruda.add(tab.contentWindow.erudaCode);
				});
				document.querySelector('.owo').onclick = () => {
					if (open == false) {
						tab.contentWindow.eruda.show();
					} else {
						tab.contentWindow.eruda.hide();
					}
	
					open = !open;
				};
			});
			document.querySelector('.delete').onclick = () => {
				blockElement(tab);
			};
		};

		a.onclick = () => {
			targetProxy.active = {
				iframe: tab,
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
			iframe: tab,
			id
		};

		document.querySelector('.tabs').append(div);
		document.querySelector('main').append(tab);
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

	iframe.contentDocument.head.appendChild(scriptEle);
	
	scriptEle.addEventListener('load', () => {
		callback();
	});
};

const blockElement = (iframe) => {
	for (const element of iframe.contentDocument.getElementsByTagName('a')) {
		(element).style.pointerEvents = 'none';
	}
	
	const handler = (e) => {
		e = e || window.event;
		const target = e.target || e.srcElement;
		target.style.display = 'none';
		
		iframe.contentDocument.removeEventListener('click', handler, false);
		cursor('default');
		
		for (const element of iframe.contentDocument.getElementsByTagName('a')) {
			(element).style.pointerEvents = 'initial';
		}
	};
	
	iframe.contentDocument.addEventListener('click', handler, false);
	const cursor = (cur) => { iframe.contentDocument.body.style.cursor = cur; };
	cursor('crosshair');
};