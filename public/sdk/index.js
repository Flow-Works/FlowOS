/* eslint-env browser */

import { config } from '../scripts/managers.js';

class FlowSDK {
  constructor (win, src) {
    const decodedUrl = window.currentProxy.decodeUrl(src.replace(/\/uv\/service\//g, ''));
    (async () => {
      this.manifest = await this.#getManifest(decodedUrl);
      this.window = win;
      if (this.manifest.permissions) this.#handlePermissions(this.manifest.permissions);
    })();
  }

  onmanifest;

  #getManifest = async (decodedUrl) => {
    const res = await fetch(new URL(decodedUrl).origin + '/flow.json');
    if (res.status === 200) {
      const manifest = await res.json();
      this.onmanifest(manifest);
      return manifest;
    } else {
      return {};
    }
  };

  #handlePermissions = async (perms) => {
    if (perms.includes('config')) { this.config = config; }
    if (perms.includes('windowManager')) { this.windowManager = window.Flow.wm; }
  };
}

export default FlowSDK;
