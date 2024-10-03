
/* eslint-env browser */

import { Tab } from './browser.js';

const proxyConfig = parent.currentProxy;

const input = document.querySelector('input');
const dropdownBtn = document.querySelector('.more');
const dropdownMenu = document.getElementById('dropdown');

let inputShowing = true;

/**
 * Creates a new tab
 * @returns {Tab}
 */
window.newTab = () => new Tab();

/**
 * Toggles the options dropdown
 * @returns {boolean}
 */
window.toggleDropdown = () => dropdownMenu.classList.toggle('show');

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

dropdownBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  window.toggleDropdown();
});

document.documentElement.addEventListener('click', () => {
  if (dropdownMenu.classList.contains('show')) {
    window.toggleDropdown();
  }
});

input.onkeydown = (e) => {
  if (e.key === 'Enter') {
    if (input.value.startsWith('flow:')) {
      window.clickList[0].src = '/builtin/browser/' + input.value.split('://')[1] + '.html';
    } else {
      let inputValue = input.value;

      if (!inputValue.startsWith('http://') && !inputValue.startsWith('https://')) {
        inputValue = 'http://' + inputValue;
      }
      window.clickList[0].src = proxyConfig.prefix + proxyConfig.encodeUrl(inputValue);
    }
  }
};

window.onload = () => {
  window.newTab();
};
