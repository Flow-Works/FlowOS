import { config } from '../scripts/managers.js';

class FlowSDK {
    constructor(window) {
        this.config = config;
        this.window = window;
    }
}

export default FlowSDK;