/* eslint-env browser */
/* global Dynamic, importScripts */

importScripts('dynamic.config.js');
importScripts('dynamic.worker.js');

const dynamic = new Dynamic();

self.dynamic = dynamic;

self.addEventListener('fetch', (event) => {
  event.respondWith(
    (async () => {
      if (await dynamic.route(event)) {
        return await dynamic.fetch(event);
      }

      return await fetch(event.request);
    })()
  );
});
