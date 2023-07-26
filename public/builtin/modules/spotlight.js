/* eslint-env browser */
/* global Flow */

import { BarItem } from '../../scripts/classes.js';

const spotlight = new BarItem('spotlight');

spotlight.setText('🔎');
spotlight.element.onclick = () => {
	Flow.spotlight.toggle();
};

export default spotlight;