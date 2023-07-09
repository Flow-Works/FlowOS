let appSwitcher = false;

const apps = {
    'visual-studio-code': { title: 'Visual Studio Code', url: 'https://vscode.dev' },
    'youtube': { title: 'YouTube', url: 'https://youtube.com' },
    'twitter': { title: 'Twitter', url: 'https://twitter.com' },
    'discord': { title: 'Discord', url: 'https://discord.com/app' },
    'settings': { title: 'Settings', url: 'https://discord.com/app' },
}

window.onload = () => {
    document.querySelector('.boot').style.opacity = 0;
    for (const [key, value] of Object.entries(apps)) {
        const li = document.createElement('li');
        li.innerHTML = `<img src="/assets/icons/${key}.svg" width="25px"/>${value.title}`;
        li.onclick = () => {
            openApp(key);
            document.querySelector('.app-switcher').style.opacity = 0;
            appSwitcher = !appSwitcher;
        };

        document.querySelector('.app-switcher .apps').append(li)
    }
}

function openApp(id) {
    new WinBox({
        title: apps[id].title,
        icon: `assets/icons/${id}.svg`,
        html: `<iframe src="${__uv$config.prefix + __uv$config.encodeUrl(apps[id].url)}"></iframe>`
    })
}

hotkeys('alt+space', (e) => {
    e.preventDefault();
    if (appSwitcher) {
        document.querySelector('.app-switcher').style.opacity = 0;
    } else {
        document.querySelector('.app-switcher').style.opacity = 1;
    }

    appSwitcher = !appSwitcher;
});

hotkeys('esc', (e) => {
    e.preventDefault();
    if (appSwitcher) {
        document.querySelector('.app-switcher').style.opacity = 0;
    }

    appSwitcher = !appSwitcher;
});