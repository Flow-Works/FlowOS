class AppData {
    constructor(APP_ID, title, url, proxy, config = {}) {
        this.APP_ID = APP_ID;
        this.title = title;
        this.url = url;
        this.proxy = proxy;
        this.config = config;
    }
}

class BarItem {
    constructor(MODULE_ID, CLICK = () => {}) {
        this.MODULE_ID = MODULE_ID;
        this.element = document.createElement('div');
        this.element.classList.add('bar-item');
        this.element.classList.add('bar-' + MODULE_ID);
        Flow.bar.add(this);
        this.element.onclick = CLICK;
    }

    setText(text) {
        this.element.innerText = text;
    }
}

class FlowInstance {
    constructor() {
        eruda.init();
    }

    boot() {
        this.apps.register();
        this.registerHotkeys();
        document.querySelector('.boot').style.opacity = 0;

        if (!window.localStorage.getItem('modules')) {
            window.localStorage.setItem('modules', JSON.stringify([
                '/builtin/modules/clock.js',
                '/builtin/modules/battery.js',
                '/builtin/modules/weather.js',
            ]));
        }

        if (!window.localStorage.getItem('apps')) {
            window.localStorage.setItem('apps', JSON.stringify([]));
        }

        if (!window.localStorage.getItem('theme')) {
            window.localStorage.setItem('theme', '/builtin/themes/catppuccin.css');
        }

        if (!window.localStorage.getItem('search')) {
            window.localStorage.setItem('search', 'https://duckduckgo.com');
        }

        JSON.parse(window.localStorage.getItem('modules')).forEach((item) => {
            this.loadJS(item);
        })

        this.loadCSS(window.localStorage.getItem('theme'))
    }

    loadCSS(FILE_URL) {
        var fileref = document.createElement("link");
        fileref.rel = "stylesheet";
        fileref.type = "text/css";
        fileref.href = FILE_URL;
        document.getElementsByTagName("head")[0].appendChild(fileref)
    }

    loadJS(FILE_URL, async = true) {
        let scriptEle = document.createElement("script");
      
        scriptEle.setAttribute("src", FILE_URL);
        scriptEle.setAttribute("type", "text/javascript");
        scriptEle.setAttribute("async", async);
      
        document.body.appendChild(scriptEle);
      
        // success event 
        scriptEle.addEventListener("load", () => {
          console.log("File loaded")
        });
         // error event
        scriptEle.addEventListener("error", (ev) => {
          console.log("Error on loading file", ev);
        });
      }

    spotlight = {
        add(app) {
            document.querySelector('.app-switcher .apps').append(app);
        },

        toggle() {
            switch (this.state) {
                case true:
                    Flow.bar.items['spotlight'].setText('🔎');
                    document.querySelector('.app-switcher').style.opacity = 0;
                    setTimeout(() => { document.querySelector('.app-switcher').style.display = "none"; }, 200)
                    break;
                case false:
                    Flow.bar.items['spotlight'].setText('❌');
                    document.querySelector('.app-switcher').style.opacity = 0;
                    document.querySelector('.app-switcher').style.display = "block";
                    setTimeout(() => { document.querySelector('.app-switcher').style.opacity = 1;  }, 100)
                    break;
            }
    
            this.state = !this.state;
        },

        state: false,
    }

    bar = {
        items: {},

        add(ITEM) {
            this.items[ITEM.MODULE_ID] = ITEM;
            document.querySelector('.bar').append(this.items[ITEM.MODULE_ID].element)
        }
    }

    registerHotkeys() {
        hotkeys('alt+space', (e) => {
            e.preventDefault();
            this.spotlight.toggle();
        });
        
        hotkeys('esc', (e) => {
            e.preventDefault();
            if (this.spotlight.state == true) this.spotlight.toggle();
        });
    }

    apps = {
        register() {
            for (const [APP_ID, value] of Object.entries(apps)) {
                const appListItem = document.createElement('li');
                appListItem.innerHTML = `<img src="/assets/icons/${APP_ID}.svg" width="25px"/>${value.title}`;
                appListItem.onclick = () => {
                    this.open(APP_ID);
                    Flow.spotlight.toggle();
                };
        
                Flow.spotlight.add(appListItem);
            }
        },

        open(APP_ID) {
            let url;
            if (apps[APP_ID].proxy == false) {
                url = apps[APP_ID].url
            } else {
                url = 'https://' + window.location.hostname + '/' + __uv$config.prefix + __uv$config.encodeUrl(apps[APP_ID].url)
            }
            new WinBox({
                title: apps[APP_ID].title,
                icon: `assets/icons/${APP_ID}.svg`,
                html: `<iframe src="${url}" scrolling="yes"></iframe>`,
                x: 'center', y: 'center',
                ...apps[APP_ID].config
            })
        }
    }
}

eruda.init();