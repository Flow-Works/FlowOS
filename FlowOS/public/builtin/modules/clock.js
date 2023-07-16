/* eslint-env browser */

import { BarItem } from '../../scripts/classes.js';

const clock = new BarItem('clock');

const clockfaces = [
	{
		face: '🕛',
		time: ['12:00', '00:00'],
	},
	{
		face: '🕧',
		time: ['12:30', '00:30'],
	},
	{
		face: '🕐',
		time: ['13:00', '01:00'],
	},
	{
		face: '🕜',
		time: ['13:30', '01:30'],
	},
	{
		face: '🕑',
		time: ['14:00', '02:00'],
	},
	{
		face: '🕝',
		time: ['14:30', '02:30'],
	},
	{
		face: '🕒',
		time: ['15:00', '03:00'],
	},
	{
		face: '🕞',
		time: ['15:30', '03:30'],
	},
	{
		face: '🕓',
		time: ['16:00', '04:00'],
	},
	{
		face: '🕟',
		time: ['16:30', '04:30'],
	},
	{
		face: '🕔',
		time: ['17:00', '05:00'],
	},
	{
		face: '🕠',
		time: ['17:30', '05:30'],
	},
	{
		face: '🕕',
		time: ['18:00', '06:00'],
	},
	{
		face: '🕡',
		time: ['18:30', '06:30'],
	},
	{
		face: '🕖',
		time: ['19:00', '07:00'],
	},
	{
		face: '🕢',
		time: ['19:30', '07:30'],
	},
	{
		face: '🕗',
		time: ['20:00', '08:00'],
	},
	{
		face: '🕣',
		time: ['20:30', '08:30'],
	},
	{
		face: '🕘',
		time: ['21:00', '09:00'],
	},
	{
		face: '🕤',
		time: ['21:30', '09:30'],
	},
	{
		face: '🕙',
		time: ['22:00', '10:00'],
	},
	{
		face: '🕥',
		time: ['22:30', '10:30'],
	},
	{
		face: '🕚',
		time: ['23:00', '11:00'],
	},
	{
		face: '🕦',
		time: ['23:30', '11:30'],
	},
];

Date.prototype.toEmoji = function () {
	return time2emoji(this.getHours(), this.getMinutes());
};

const time2emoji = (hours, mins) => {
	const minutes = parseInt(mins);
	return clockfaces.find((element) => {
		return element.time.find((time) => {
			const minute = parseInt(time.split(':')[1]);
			return ((minute == 30 && minutes >= 15 && minutes <= 45) ||
				(minute == 0 && (minutes < 15 || minutes > 45))) &&
			hours == time.split(':')[0];
		});
	}).face;
};

const startTime = () => {
	const today = new Date();
	let h = today.getHours();
	let m = today.getMinutes();
	h = checkTime(h);
	m = checkTime(m);
	clock.setText(`${time2emoji(h, m)} ${h}:${m}`);
	setTimeout(startTime, 1000);
};

const checkTime = (i) => {
	if (i < 10) {
		i = `0${i}`;
	};
	return i;
};

startTime();

export default clock;