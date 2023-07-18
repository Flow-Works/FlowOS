/* eslint-env browser */

import config from '../../../scripts/configManager.js';
import '/stomp/bootstrapper.js';

const input = document.querySelector('input');

const dropdownBtn = document.querySelector('.more');
const dropdownMenu = document.getElementById('dropdown');

const toggleDropdown = () => {
	dropdownMenu.classList.toggle('show');
};

dropdownBtn.addEventListener('click', (e) => {
	e.stopPropagation();
	toggleDropdown();
});

document.documentElement.addEventListener('click', () => {
	if (dropdownMenu.classList.contains('show')) {
	  toggleDropdown();
	}
  });

let id = 0;

window.clickList = [];
const tabs = [];

const proxyConfig = parent.currentProxy;

let inputShowing = true;

const history = {
	add: (url, title, favicon) => {
		return window.localStorage.setItem('history', JSON.stringify([{ url, title, favicon, date: new Date() }, ...history.get()]));
	},
	get: () => {
		return JSON.parse(window.localStorage.getItem('history'));
	}
};

if (!window.localStorage.getItem('history')) {
	window.localStorage.setItem('history', '[]');
}

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

		tab.src = proxyConfig.prefix + proxyConfig.encodeUrl(config.settings.get('search').url);
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

			if (tabs.includes(window.clickList.at(-1))) {
				setActiveTab(window.clickList.at(-1));
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
	window.clickList.push(tab);

	if (!tab && window.clickList[0] !== window.clickList[1]) {
		return;
	}

	try { input.value = proxyConfig.decodeUrl(tab.src.split('/').pop()); }
	catch(e) {};
	tab.style.display = 'block';
	if (window.clickList.length > 1) {
		window.clickList.at(-2).style.display = 'none';
	}
};

const handleTab = (tab, titleBtn, img) => {
	let open = false;
	const unurl = tab.src.split('/').pop();
	let url = proxyConfig.decodeUrl(unurl);

	if (tab.contentWindow.location.pathname.startsWith('/builtin/browser')) {
		input.value = 'flow://' + url.split('/').pop().split('.')[0];
	} else {
		input.value = url;
		history.add(tab.contentWindow.location.href, tab.contentDocument.title, `https://s2.googleusercontent.com/s2/favicons?domain_url=${url}`);
	}
	titleBtn.innerText = `${tab.contentDocument.title} `;
	console.log(unurl, url);
	img.src = `https://s2.googleusercontent.com/s2/favicons?domain_url=${url}`;
	
	config.settings.get('search').urls.forEach((url) => {
		injectJS(tab, url, false, () => {});
	});
			
	if (proxyConfig.proxyName !== 'stomp') {
		injectJS(tab, 'https://cdn.jsdelivr.net/npm/eruda', true, () => {
			injectJS(tab, 'https://cdn.jsdelivr.net/npm/eruda-code', true, () => {
				tab.contentWindow.eruda.add(tab.contentWindow.erudaCode);
			});

			tab.contentWindow.eruda.init({ tool: ['console', 'elements', 'code', 'sources'] });
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
	} else {
		document.querySelector('.eruda').parentElement.style.display = 'none';
	}
	
	document.querySelector('.block').onclick = () => {
		blockElement(tab);
	};
};

const injectJS = (tab, FILE_URL, async = true, callback) => {
	const scriptEle = document.createElement('script');

	scriptEle.setAttribute('src', FILE_URL);
	scriptEle.setAttribute('defer', async);

	tab.contentDocument.body.appendChild(scriptEle);
	
	scriptEle.addEventListener('load', () => {
		callback();
	});

	scriptEle.addEventListener('error', (e) => {
		console.error(e);
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
		if (input.value.startsWith('flow:')) {
			window.clickList[0].src = '/builtin/browser/' + input.value.split(':')[1] + '.html';
		} else {
			window.clickList[0].src = proxyConfig.prefix + proxyConfig.encodeUrl(input.value);
		}
	}
};

document.querySelector('.hide').onclick = () => {
	switch (inputShowing) {
		case true:
			document.querySelector('.hide').innerText = 'expand_more';
			document.querySelector('.tb').style.display = 'none';
			break;
		case false:
			document.querySelector('.hide').innerText = 'expand_less';
			document.querySelector('.tb').style.display = 'flex';
			break;
	}

	inputShowing = !inputShowing;
};