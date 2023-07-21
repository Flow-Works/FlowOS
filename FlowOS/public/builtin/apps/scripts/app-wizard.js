/* eslint-env browser */

import { config } from '../../../scripts/managers.js';

document.querySelector('.json').onsubmit = async () => {
    const res = await fetch(document.querySelector('input').value);
    const data = await res.json();

    const obj = {
        ...config.apps.get()
    };
    if (config.apps.get()[data.APP_ID]) {
        delete obj[data.APP_ID];
    } else {
        obj[data.APP_ID] = data;
    }
    config.apps.set(obj);
    parent.document.querySelector('.app-switcher .apps').innerHTML = '';
    parent.Flow.apps.register();
};

document.querySelector('.json').onsubmit = () => {
    const data = JSON.parse(document.querySelector('textarea').value);
    const obj = {
        ...config.apps.get()
    };
    if (config.apps.get()[data.APP_ID]) {
        delete obj[data.APP_ID];
    } else {
        obj[data.APP_ID] = data;
    }
    config.apps.set(obj);
    parent.document.querySelector('.app-switcher .apps').innerHTML = '';
    parent.Flow.apps.register();
};