/* eslint-env browser */

import { config } from '../../scripts/managers.js';
import { BarItem, SettingsCategory, SettingsInput, SettingsDropdown } from '../../scripts/classes.js';

const weather = new BarItem('weather');
new SettingsCategory('weather', 'Weather', 
    new SettingsInput('city', 'City Name', 'London', 'London'),
    new SettingsDropdown('measurement', 'Measurement System', 'Celsius', ['Celsius', 'Fahrenheit']),
);

const weatherMap = {
    1000: '☀️',
    1003: '⛅',
    1006: '☁️',
    1009: '🌫️',
    1030: '🌁',
    1063: '🌦️',
    1066: '🌨️',
    1069: '🌨️',
    1072: '🌨️',
    1087: '⛈️',
    1114: '❄️',
    1117: '❄️',
    1135: '🌫️',
    1147: '🌫️',
    1150: '🌧️',
    1153: '🌧️',
    1168: '🌧️',
    1171: '🌧️',
    1180: '🌧️',
    1183: '🌧️',
    1186: '🌧️',
    1189: '🌧️',
    1192: '🌧️',
    1195: '🌧️',
    1198: '🌧️',
    1201: '🌧️',
    1204: '🌨️',
    1207: '🌨️',
    1210: '🌨️',
    1213: '🌨️',
    1216: '🌨️',
    1219: '🌨️',
    1222: '🌨️',
    1225: '🌨️',
    1237: '🌧️',
    1240: '🌧️',
    1243: '🌧️',
    1246: '🌧️',
    1249: '🌨️',
    1252: '🌨️',
    1255: '🌨️',
    1258: '🌨️',
    1261: '🌨️',
    1264: '🌨️',
    1273: '🌩️',
    1276: '🌩️',
    1279: '🌩️',
    1282: '🌩️'
};

const startWeather = () => {
    fetch(`https://api.weatherapi.com/v1/current.json?key=0470cf1ea60241eeae4172153230907&q=${config.settings.get('weather').city}&aqi=no`)
        .then(res => res.json())
        .then(data => {
            const type = config.settings.get('weather').measurement == 'Celsius' ? 'c' : 'f';
            weather.setText(`${weatherMap[data.current.condition.code]} ${data.current[`temp_${type}`]}°${type.toUpperCase()}`);
        });
    setTimeout(startWeather, 60_000);
};

startWeather();

export default weather;