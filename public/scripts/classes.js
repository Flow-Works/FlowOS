/* eslint-env browser */
/* global Flow */

export class AppData {
  constructor (APP_ID, title, url, icon, proxy, config = {}) {
    this.APP_ID = APP_ID;
    this.icon = icon;
    this.title = title;
    this.url = url;
    this.proxy = proxy;
    this.config = config;
  }
}

export class SettingsCategory {
  constructor (SETTING_ID, title, inputs) {
    this.SETTING_ID = SETTING_ID;
    this.title = title;
    this.inputs = inputs;
    try {
      Flow.settings.add(this);
    } catch (e) {
      parent.Flow.settings.add(this);
    }
  }
}

export class SettingsFormItem {
  constructor (SETTING_INPUT_ID, label, type, placeholder = '', defaultValue = '') {
    this.SETTING_INPUT_ID = SETTING_INPUT_ID;
    this.label = label;
    this.type = type;
    this.placeholder = placeholder;
    this.defaultValue = defaultValue;
    return this;
  }
}

export class SettingsInput extends SettingsFormItem {
  constructor (SETTING_INPUT_ID, label, placeholder = '', defaultValue = '') {
    super(SETTING_INPUT_ID, label, 'input', placeholder, defaultValue);
    return this;
  }
}

export class SettingsTextarea extends SettingsFormItem {
  constructor (SETTING_INPUT_ID, label, placeholder = '', defaultValue = '') {
    super(SETTING_INPUT_ID, label, 'textarea', placeholder, defaultValue);
    return this;
  }
}

export class SettingsDropdown extends SettingsFormItem {
  constructor (SETTING_INPUT_ID, label, defaultValue, options) {
    super(SETTING_INPUT_ID, label, 'select', '', defaultValue);
    this.options = options;
    return this;
  }
}

export class BarItem {
  constructor (MODULE_ID, metadata) {
    this.MODULE_ID = MODULE_ID;
    this.metadata = metadata;

    this.element = document.createElement('div');
    this.element.classList.add('statusbar-item');
    this.element.classList.add(`statusbar-${MODULE_ID}`);

    this.textElement = document.createElement('div');

    this.iconsElement = document.createElement('span');
    this.iconsElement.classList.add('statusbar-icons');
  }

  setText (text) {
    this.textElement.innerText = text;
    this.element.append(this.textElement);
  }

  setIcons (icons) {
    this.iconsElement.innerHTML = '';
    icons.forEach((icon) => {
      const iconElement = document.createElement('span');
      iconElement.innerText = icon;
      this.iconsElement.append(iconElement);
    });
    this.element.append(this.iconsElement);
  }
}
