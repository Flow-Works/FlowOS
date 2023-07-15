const input = document.querySelector('input');

let id = 0;

const clickList = [];
const tabs = [];

const uv = parent.__uv$config;

let inputShowing = true;

class Tab {
	constructor() {
		id++;
		const _id = id;

		const div = document.createElement('div');
		const titleBtn = document.createElement('a');
		const closeBtn = document.createElement('a');
		const tab = document.createElement('iframe');
		const img = document.createElement('img');

		titleBtn.id = id;
		titleBtn.innerText = 'Loading... ';
		titleBtn.href = '#';

		closeBtn.innerText = '[x]';
		closeBtn.href = '#';

		img.width = '18';
		img.height = '18';
		img.src = '/assets/loading.gif';

		tab.src = uv.prefix + uv.encodeUrl(parent.config.settings.get('search').url);
		tab.id = id;
		tab.onload = () => {
			handleTab(tab, titleBtn, img);
		};

		tabs.push({ tab, id: _id });

		titleBtn.onclick = () => {
			setActiveTab(tab);
		};

		closeBtn.onclick = () => {
			tab.remove();
			div.remove();

			removeObjectWithId(tabs, _id);

			if (tabs.includes(clickList.at(-1))) {
				setActiveTab(clickList.at(-1));
			} else if (tabs.at(-1)) {
				setActiveTab(tabs.at(-1));
			} else {
				new Tab();
			}
		};

		div.appendChild(img);
		div.appendChild(titleBtn);
		div.appendChild(closeBtn);

		document.querySelector('.tabs').append(div);
		document.querySelector('main').append(tab);

		setActiveTab(tab);
	}
}

window.onload = () => {
	new Tab();
	document.querySelector('.tabs').addEventListener('wheel', (evt) => {
    	evt.preventDefault();
    	document.querySelector('.tabs').scrollLeft += evt.deltaY;
	});
};

const setActiveTab = (tab) => {
	clickList.push(tab);

	if (!tab && clickList[0] !== clickList[1]) {
		return;
	}

	input.value = uv.decodeUrl(tab.src.split('/').pop());
	tab.style.display = 'block';
	if (clickList.length > 1) {
		clickList.at(-2).style.display = 'none';
	}
};

const handleTab = (tab, titleBtn, img) => {
	let open = false;
	const url = uv.decodeUrl(tab.src.split('/').pop());

	input.value = url;
	titleBtn.innerText = `${tab.contentDocument.title} `;
	img.src = `https://s2.googleusercontent.com/s2/favicons?domain_url=${url}`;
	
	parent.config.settings.get('search').urls.forEach((url) => {
		injectJS(tab, url, false, () => {});
	});
			
	injectJS(tab, 'https://cdn.jsdelivr.net/npm/eruda', false, () => {
		injectJS(tab, 'https://cdn.jsdelivr.net/npm/eruda-code', false, () => {
			tab.contentWindow.eruda.add(tab.contentWindow.erudaCode);
		});

		tab.contentWindow.eruda.init({ tool: ['console', 'elements', 'code', 'source'] });
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

input.onkeydown = (e) => {
	if (e.key == 'Enter') {
		clickList[0].src = uv.prefix + uv.encodeUrl(input.value);
	}
};

document.querySelector('.hide').onclick = () => {
	switch (inputShowing) {
		case true:
			document.querySelector('.hide').innerText = '⬇️';
			input.style.display = 'none';
			break;
		case false:
			document.querySelector('.hide').innerText = '⬆️';
			input.style.display = 'block';
			break;
	}

	inputShowing = !inputShowing;
};