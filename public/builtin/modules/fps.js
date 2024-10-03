/* eslint-env browser */
import { BarItem } from '../../scripts/classes.js';

const fps = new BarItem('fps', { position: 'right' });

let lastCalledTime;
let counter = 0;
const fpsArray = [];

const update = () => {
  let frps;

  if (!lastCalledTime) {
    lastCalledTime = new Date().getTime();
    frps = 0;
  }

  const delta = (new Date().getTime() - lastCalledTime) / 1000;
  lastCalledTime = new Date().getTime();
  frps = Math.ceil(1 / delta);

  if (counter >= 60) {
    counter = 0;
  } else {
    if (frps !== Infinity) {
      fpsArray.push(frps);
    }

    counter++;
  }

  fps.setText(`${frps} FPS`);

  window.requestAnimationFrame(update);
};

window.requestAnimationFrame(update);

export default fps;
