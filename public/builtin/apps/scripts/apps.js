/* eslint-env browser */

import { config } from '../../../scripts/managers.js';

import('https://flow-works.github.io/appstore/apps.js').then((appStore) => {
  Object.values(appStore.default).forEach((data) => {
    const a = document.createElement('div');
    a.classList.add('tooltip');
    a.href = '#';

    const h3 = document.createElement('h3');
    const p = document.createElement('p');
    const button = document.createElement('button');
    p.innerText = data.url;
    h3.innerText = data.title;

    const span = document.createElement('span');
    if (config.apps.get()[data.APP_ID]) {
      button.innerText = 'Uninstall';
      h3.innerText = `${data.title} (Installed)`;
      span.innerText = `${data.title} (Installed)`;
    } else {
      button.innerText = 'Install';
      h3.innerText = data.title;
      span.innerText = data.title;
    }
    a.appendChild(span);

    const img = document.createElement('img');
    img.setAttribute('width', '100px');
    img.src = data.icon;
    a.appendChild(img);
    a.appendChild(h3);
    h3.appendChild(p);
    button.style.background = 'var(--window-bg)';
    h3.appendChild(button);

    button.onclick = () => {
      const obj = {
        ...config.apps.get()
      };
      if (config.apps.get()[data.APP_ID]) {
        delete obj[data.APP_ID];
      } else {
        obj[data.APP_ID] = data;
      }
      config.apps.set(obj);
      window.location.reload();
      parent.document.querySelector('.spotlight .apps').innerHTML = '';
      parent.Flow.apps.register();
    };

    document.querySelector('.apps').appendChild(a);
  });

  const tooltips = document.querySelectorAll('.tooltip span');

  window.onmousemove = (e) => {
    const x = `${e.clientX + 20}px`;
    const y = `${e.clientY + 20}px`;
    for (const tooltip of tooltips) {
      tooltip.style.top = y;
      tooltip.style.left = x;
    }
  };
});
