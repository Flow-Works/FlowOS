let id = 0;

var targetObj = {
    active: {
        iframe: null,
        permID: null
    }
};
let history = [];
var targetProxy = new Proxy(targetObj, {
    set: function (target, key, value) {
        history = [value.permID].concat(history);

        if (history.length > 1) {
            if (history[0] !== history[1]) {
                value.iframe.style.display = "block";
                try {
                    document.querySelector(`iframe[id="${
                        history[1]
                    }"]`).style.display = "none";
                } catch (e) {};
                target[key] = value;
            }
        }
        return true;
    }
});

class Tab {
    constructor() {
        id += 1;
        const permID = id;

        const div = document.createElement('div');

        const a = document.createElement('a');
        a.id = permID;
        a.innerText = "Loading... ";
        a.href = '#';

        const a2 = document.createElement('a');
        a2.innerText = "[x]";
        a2.href = '#';

        div.appendChild(a);
        div.appendChild(a2);

        const iframe = document.createElement('iframe');
        iframe.src = __uv$config.prefix + __uv$config.encodeUrl('https://google.com');
        iframe.id = permID;
        iframe.onload = () => {
            a.innerText = iframe.contentDocument.title + ' ';
        };

        a.onclick = () => {
            targetProxy.active = {
                iframe,
                permID
            };
        };

        a2.onclick = () => {
            iframe.remove();
            div.remove();
            targetProxy.active = {
                iframe: document.querySelector(`iframe[id="${
                    history[1]
                }"]`),
                permID: history[1]
            };
        };

        targetProxy.active = {
            iframe,
            permID
        };

        document.querySelector('.tabs').append(div);
        document.querySelector('main').append(iframe);
    }
}

window.onload = () => {
    new Tab();
}
