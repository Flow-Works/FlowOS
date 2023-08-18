/* eslint-env browser */

import { config } from '../../scripts/managers.js';
import { BarItem, SettingsCategory, SettingsInput, SettingsDropdown } from '../../scripts/classes.js';

const weather = new BarItem('weather', { position: 'left' });
const weatherSettings = new SettingsCategory('weather', 'Weather', [
  new SettingsInput('city', 'City Name', 'London', 'London'),
  new SettingsDropdown('measurement', 'Measurement System', 'Celsius', ['Celsius', 'Fahrenheit'])
]);
window.weatherSettings = () => weatherSettings;

const weatherMap = {
  1000: '', // Clear Sky
  1003: '', // Partly Cloudy
  1006: '', // Cloudy
  1009: '', // Overcast
  1030: '', // Mist
  1063: '', // Patchy Rain
  1066: '', // Patchy Snow
  1069: '', // Patchy Sleet
  1072: '', // Patchy Freezing Drizzle
  1087: '', // Thundery Outbreaks
  1114: '', // Blowing Snow
  1117: '', // Blizzard
  1135: '', // Fog
  1147: '', // Freezing Fog
  1150: '', // Patchy Light Drizzle
  1153: '', // Light Drizzle
  1168: '', // Freezing Drizzle
  1171: '', // Heavy Freezing Drizzle
  1180: '', // Patchy Light Rain
  1183: '', // Light Rain
  1186: '', // Moderate Rain at Times
  1189: '', // Moderate Rain
  1192: '', // Heavy Rain at Times
  1195: '', // Heavy Rain
  1198: '', // Light Freezing Rain
  1201: '', // Moderate/Heavy Freezing Rain
  1204: '', // Light Sleet
  1207: '', // Moderate/Heavy Sleet
  1210: '', // Patchy Light Snow
  1213: '', // Light Snow
  1216: '', // Patchy Moderate Snow
  1219: '', // Moderate Snow
  1222: '', // Patchy Heavy Snow
  1225: '', // Heavy Snow
  1237: '', // Ice Pellets
  1240: '', // Light Rain Shower
  1243: '', // Moderate/Heavy Rain Shower
  1246: '', // Torrential Rain Shower
  1249: '', // Light Sleet Showers
  1252: '', // Moderate/Heavy Sleet Showers
  1255: '', // Light Snow Showers
  1258: '', // Moderate/Heavy Snow Showers
  1261: '', // Light Showers of Ice Pellets
  1264: '', // Moderate/Heavy Showers of Ice Pellets
  1273: '', // Patchy Light Rain with Thunder
  1276: '', // Moderate/Heavy Rain with Thunder
  1279: '', // Patchy Light Snow with Thunder
  1282: '' // Moderate/Heavy Snow with Thunder
};

const startWeather = () => {
  fetch(`https://api.weatherapi.com/v1/current.json?key=0470cf1ea60241eeae4172153230907&q=${config.settings.get('weather').city}&aqi=no`)
    .then(res => res.json())
    .then(data => {
      const type = config.settings.get('weather').measurement === 'Celsius' ? 'c' : 'f';
      weather.setIcons([weatherMap[data.current.condition.code]]);
      weather.setText(`${data.current[`temp_${type}`]}°${type.toUpperCase()}`);
    });
  setTimeout(startWeather, 60_000);
};

startWeather();

export default weather;
