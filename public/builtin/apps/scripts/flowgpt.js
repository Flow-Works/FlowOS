/* eslint-env browser */

import { marked } from 'https://cdn.jsdelivr.net/npm/marked@5.1.1/+esm';
import { config } from '../../../scripts/managers.js';

const logs = [];
document.querySelector('form').onsubmit = async (e) => {
  e.preventDefault();

  const you = new ChatLog('You');
  const gpt = new ChatLog('FlowGPT');

  const value = document.querySelector('input').value;
  document.querySelector('input').value = '';

  document.querySelector('button').disabled = true;
  logs.push({ role: 'user', content: value });
  you.set(value);

  const res = await fetch('/ai/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ model: config.settings.get('flowgpt').model, logs: [...logs, { role: 'user', content: value }] })
  });

  const data = await res.json();

  logs.push(data);
  gpt.set(data.content);
  document.querySelector('button').disabled = false;
};

class ChatLog {
  constructor (name) {
    this.name = name;
    this.div = document.createElement('div');
    this.div.innerHTML += `<b>${name}</b>: <img src="/assets/loading.gif" style="position:relative;top:2.5px;" width="15px"/><br/><br/>`;
    document.querySelector('.fill').appendChild(this.div);
  }

  set = (content) => {
    this.div.innerHTML = `<b>${this.name}</b>: ${marked.parse(content)}<br/><br/>`;
  };
}
