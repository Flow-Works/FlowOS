/* eslint-env browser */

import { BarItem } from '../../scripts/classes.js';

const clock = new BarItem('clock', { position: 'right' });

const clockfaces = [
  {
    face: '󱑖', // Clock face for 12:00 / 00:00
    time: ['12:00', '00:00']
  },
  {
    face: '󱑋', // Clock face for 13:00 / 01:00
    time: ['13:00', '01:00']
  },
  {
    face: '󱑌', // Clock face for 14:00 / 02:00
    time: ['14:00', '02:00']
  },
  {
    face: '󱑍', // Clock face for 15:00 / 03:00
    time: ['15:00', '03:00']
  },
  {
    face: '󱑎', // Clock face for 16:00 / 04:00
    time: ['16:00', '04:00']
  },
  {
    face: '󱑏', // Clock face for 17:00 / 05:00
    time: ['17:00', '05:00']
  },
  {
    face: '󱑐', // Clock face for 18:00 / 06:00
    time: ['18:00', '06:00']
  },
  {
    face: '󱑑', // Clock face for 19:00 / 07:00
    time: ['19:00', '07:00']
  },
  {
    face: '󱑒', // Clock face for 20:00 / 08:00
    time: ['20:00', '08:00']
  },
  {
    face: '󱑓', // Clock face for 21:00 / 09:00
    time: ['21:00', '09:00']
  },
  {
    face: '󱑔', // Clock face for 22:00 / 10:00
    time: ['22:00', '10:00']
  },
  {
    face: '󱑕', // Clock face for 23:00 / 11:00
    time: ['23:00', '11:00']
  }
];

const time2emoji = (hours, mins) => {
  const minutes = parseInt(mins);
  const clockFace = clockfaces.find((element) => {
    return element.time.find((time) => {
      const minute = parseInt(time.split(':')[1]);
      return (
        ((minutes >= 15 && minutes <= 45) || (minute === 0 && (minutes < 15 || minutes > 45))) && hours.toString() === time.split(':')[0]
      );
    });
  });
  return clockFace.face;
};

const startTime = () => {
  const today = new Date();
  let h = today.getHours();
  let m = today.getMinutes();
  h = checkTime(h);
  m = checkTime(m);
  clock.setIcons([time2emoji(h, m)]);
  clock.setText(`${h}:${m}`);
  setTimeout(startTime, 1000);
};

const checkTime = (i) => {
  if (i < 10) {
    i = `0${i}`;
  }
  return i;
};

startTime();

export default clock;
