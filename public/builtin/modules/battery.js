/* eslint-env browser */

import { BarItem } from '../../scripts/classes.js';

const battery = new BarItem('battery');

if (navigator.getBattery) {
    navigator.getBattery().then((bt) => {
        battery.setText(`${bt.charging ? '⚡' : '🔋'} ${Math.round(bt.level * 100)}%`);

        bt.addEventListener('levelchange', () => {
            battery.setText(`${bt.charging ? '⚡' : '🔋'} ${Math.round(bt.level * 100)}%`);
        });

        bt.addEventListener('chargingchange', () => {
            battery.setText(`${bt.charging ? '⚡' : '🔋'} ${Math.round(bt.level * 100)}%`);
        });
    });
}

export default battery;