/* eslint-env browser */

import { BarItem } from '../../scripts/classes.js';

const battery = new BarItem('battery', { position: 'right' });

const icons = {
  10: '󰁺',
  20: '󰁻',
  30: '󰁼',
  40: '󰁽',
  50: '󰁾',
  60: '󰁿',
  70: '󰂀',
  80: '󰂁',
  90: '󰂂',
  100: '󰁹'
};

if (navigator.getBattery) {
  navigator.getBattery().then((bt) => {
    battery.setIcons([bt.charging ? '󰂄' : icons[Math.round(10 * bt.level * 100) / 10]]);
    battery.setText(`${Math.round(bt.level * 100)}%`);

    bt.addEventListener('levelchange', () => {
      battery.setIcons([bt.charging ? '󰂄' : icons[Math.round(10 * bt.level * 100) / 10]]);
      battery.setText(`${Math.round(bt.level * 100)}%`);
    });

    bt.addEventListener('chargingchange', () => {
      battery.setIcons([bt.charging ? '󰂄' : icons[Math.round(10 * bt.level * 100) / 10]]);
      battery.setText(`${Math.round(bt.level * 100)}%`);
    });
  });
} else {
  battery.setIcons(['󰂃']);
}

export default battery;
