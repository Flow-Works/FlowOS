/* eslint-env browser */
/* global Flow */

class AppData {
	constructor(APP_ID, title, url, proxy, config = {}) {
		this.APP_ID = APP_ID;
		this.title = title;
		this.url = url;
		this.proxy = proxy;
		this.config = config;
	}
}

class SettingsCategory {
	constructor(SETTING_ID, title, ...inputs) {
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

class SettingsFormItem {
	constructor(SETTING_INPUT_ID, label, type, placeholder = '', defaultValue = '') {
		this.SETTING_INPUT_ID = SETTING_INPUT_ID;
		this.label = label;
		this.type = type;
		this.placeholder = placeholder;
		this.defaultValue = defaultValue;
		return this;
	}
}

class SettingsInput extends SettingsFormItem {
	constructor(SETTING_INPUT_ID, label, placeholder = '', defaultValue = '') {
		super(SETTING_INPUT_ID, label, 'input', placeholder, defaultValue);
		return this;
	}
}

class SettingsTextarea extends SettingsFormItem {
	constructor(SETTING_INPUT_ID, label, placeholder = '', defaultValue = '') {
		super(SETTING_INPUT_ID, label, 'textarea', placeholder, defaultValue);
		return this;
	}
}

class SettingsDropdown extends SettingsFormItem {
	constructor(SETTING_INPUT_ID, label, defaultValue = '', options = []) {
		super(SETTING_INPUT_ID, label, 'select', '', defaultValue);
		this.options = options;
		return this;
	}
}

class BarItem {
	constructor(MODULE_ID) {
		this.MODULE_ID = MODULE_ID;
		this.element = document.createElement('div');
		this.element.classList.add('bar-item');
		this.element.classList.add(`bar-${MODULE_ID}`);
	}

	setText(text) {
		this.element.innerText = text;
	}
}

export { AppData, SettingsCategory, SettingsInput, SettingsDropdown, SettingsTextarea, BarItem };