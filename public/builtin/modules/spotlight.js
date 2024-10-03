/* global Flow */
import { BarItem } from '../../scripts/classes.js';

const spotlight = new BarItem('spotlight', { position: 'left' });

spotlight.setIcons(['󰍉']);
spotlight.element.onclick = () => {
  Flow.spotlight.toggle();
};

export default spotlight;
