/* eslint-env browser */
/* global Flow */
export default class Logger {
  log (type, color, msg) {
    console.log(
      `%cFlowOS%c${type.toUpperCase()}%c ${msg}`,
      'padding:2.5px 10px;color:white;border-radius:10px;background:#363a4f;margin-right:5px;',
      `padding:2.5px 10px;color:white;border-radius:10px;background:${color};`,
      'padding:2.5px;'
    );
  }

  info (msg) {
    this.log('info', '#8aadf4', msg);
  }

  error (msg) {
    this.log('error', '#ed8796', msg);

    Flow.wm.createPopup('info', 'Error', msg);
  }

  success (msg) {
    this.log('success', '#a6da95', msg);
  }

  debug (msg) {
    this.log('debug', '#c6a0f6', msg);
  }
}
