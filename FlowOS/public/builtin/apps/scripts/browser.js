let id = 0;

const history = [];
const tabs = [];

class Tab {
	constructor() {
		id++;
		const _id = id;

		const div = document.createElement('div');
		const titleBtn = document.createElement('a');
		const closeBtn = document.createElement('a');
		const tab = document.createElement('iframe');

		titleBtn.id = id;
		titleBtn.innerText = 'Loading... ';
		titleBtn.href = '#';

		closeBtn.innerText = '[x]';
		closeBtn.href = '#';

		tab.src = parent.__uv$config.prefix + parent.__uv$config.encodeUrl(parent.config.settings.get('search').url);
		tab.id = id;
		tab.onload = () => handleTab(tab, titleBtn);

		tabs.push({ tab, id: _id });

		titleBtn.onclick = () => {
			setActiveTab(_id);
		};

		closeBtn.onclick = () => {
			tab.remove();
			div.remove();

			removeObjectWithId(tabs, _id);

			if (tabs == []) {
				new Tab();
			} else {
				if (tabs.includes(history.at(-1))) {
					setActiveTab(history.at(-1));
				} else {
					setActiveTab(tabs.at(-1));
				}
			}
		};

		setActiveTab(_id);

		div.appendChild(titleBtn);
		div.appendChild(closeBtn);

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

const setActiveTab = (id) => {
	const tab = tabs.find(x => x.id == id);
	
	if (tab && history[0] !== history[1]) {
		history.push(tab);

		tabs.find(x => x.id == id).tab.style.display = 'block';
		if (history.length > 1) {
			history.at(-2).tab.style.display = 'none';
		}
	}
};

const handleTab = (tab, titleBtn) => {
	let open = false;

	titleBtn.innerText = `${tab.contentDocument.title} `;
	
	parent.config.settings.get('search').urls.forEach((url) => {
		injectJS(tab, url, false, () => {});
	});
			
	injectJS(tab, 'https://cdn.jsdelivr.net/npm/eruda', false, () => {
		injectJS(tab, 'https://cdn.jsdelivr.net/npm/eruda-code', false, () => {
			tab.contentWindow.eruda.add(tab.contentWindow.erudaCode);
		});

		tab.contentWindow.eruda.init({ tool: ['console', 'elements', 'code'] });
		tab.contentWindow.eruda._entryBtn.hide();

		document.querySelector('.eruda').onclick = () => {
			if (open == false) {
				tab.contentWindow.eruda.show();
			} else {
				tab.contentWindow.eruda.hide();
			}
	
			open = !open;
		};
	});
	
	document.querySelector('.block').onclick = () => {
		blockElement(tab);
	};
};

const injectJS = (tab, FILE_URL, async = true, callback) => {
	const scriptEle = document.createElement('script');

	scriptEle.setAttribute('src', FILE_URL);
	scriptEle.setAttribute('type', 'text/javascript');
	scriptEle.setAttribute('async', async);

	tab.contentDocument.head.appendChild(scriptEle);
	
	scriptEle.addEventListener('load', () => {
		callback();
	});
};

const blockElement = (tab) => {
	for (const element of tab.contentDocument.getElementsByTagName('a')) {
		(element).style.pointerEvents = 'none';
	}
	
	const handler = (e) => {
		e = e || window.event;
		const target = e.target || e.srcElement;
		target.style.display = 'none';
		
		tab.contentDocument.removeEventListener('click', handler, false);
		cursor('default');
		
		for (const element of tab.contentDocument.getElementsByTagName('a')) {
			(element).style.pointerEvents = 'initial';
		}
	};
	
	tab.contentDocument.addEventListener('click', handler, false);
	const cursor = (cur) => { tab.contentDocument.body.style.cursor = cur; };
	cursor('crosshair');
};

const removeObjectWithId = (arr, id) => {
	arr.splice(arr.findIndex((i) => {
		return i.id === id;
	}), 1);
};