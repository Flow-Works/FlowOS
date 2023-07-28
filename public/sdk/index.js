/* eslint-env browser */

import { config } from '../scripts/managers.js';

class FlowSDK {
    constructor(win, src) {
        const decodedUrl = window.currentProxy.decodeUrl(src.replace(/\/uv\/service\//g, ''));
        (async () => {
            const manifest = await this.#getManifest(decodedUrl);
            this.window = win;
            if (manifest.permissions) this.#handlePermissions(manifest.permissions);
        })();
    }

    #getManifest = async (decodedUrl) => {
        const res = await fetch(new URL(decodedUrl).origin + '/flow.json');
        if (res.status === 200) {
            const perms = await res.json();
            return perms;
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