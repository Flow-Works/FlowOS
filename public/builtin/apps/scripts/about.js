/* eslint-env browser */

window.onload = () => {
  document.querySelector('v').innerHTML = `<a target="_blank" href="${parent.Flow.url.replace(/\.git/g, '')}/commit/${parent.Flow.version.substring(0, 8)}">${parent.Flow.version.substring(0, 8)}</a> (${parent.Flow.branch})`;
};
