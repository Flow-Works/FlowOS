(async function() {
    const VERSION = 31.6;
    if ((window.location && ['localhost', '127.0.0.1'].includes(location.hostname)) ||
       'undefined' != typeof EJS_DEBUG_XX && true === EJS_DEBUG_XX) {
        fetch('https://raw.githack.com/EmulatorJS/EmulatorJS/main/data/version.json').then(response => {
            if (response.ok) {
                response.text().then(body => {
                    const version = JSON.parse(body);
                    if (VERSION < version.current_version) {
                        console.log(`Using emulatorjs version ${VERSION} but the newest version is ${version.current_version}\nopen https://github.com/EmulatorJS/EmulatorJS to update`);
                    }
                })
            }
        })
    }
    function loadStyle(file) {
        return new Promise((resolve, reject) => {
            const css = document.createElement('link');
            css.rel = 'stylesheet';
            css.href = (() => {
                if ('undefined' != typeof EJS_paths && typeof EJS_paths[file] == 'string') {
                    return EJS_paths[file];
                } else if ('undefined' == typeof EJS_pathtodata) {
                    return `${file}?v=${VERSION}`;
                } else {
                    if (!EJS_pathtodata.endsWith('/')) EJS_pathtodata+='/';
                    return `${EJS_pathtodata+file}?v=${VERSION}`;
                }
            })();
            css.onload = resolve;
            document.head.appendChild(css);
        })
    }
    function loadScript(file) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = (() => {
                if ('undefined' != typeof EJS_paths && typeof EJS_paths[file] == 'string') {
                    return EJS_paths[file];
                } else if ('undefined' == typeof EJS_pathtodata) {
                    return `${file}?v=${VERSION}`;
                } else {
                    if (!EJS_pathtodata.endsWith('/')) EJS_pathtodata+='/';
                    return `${EJS_pathtodata+file}?v=${VERSION}`;
                }
            })();
            script.onload = resolve;
            document.head.appendChild(script);
        })
    }
    if (('undefined' != typeof EJS_DEBUG_XX && true === EJS_DEBUG_XX) ||
        /(iPad|iPhone|iPod|Macintosh)/gi.test(navigator.userAgent)) {
        await loadStyle('emu-css.css');
        await loadScript('emu-main.js');
        await loadScript('emulator.js');
    } else {
        await loadStyle('emu-css.min.css');
        await loadScript('emulator.min.js');
    }
    const config = {};
    config.gameUrl = EJS_gameUrl;
    if ('undefined' != typeof EJS_mameCore) config.mameCore = EJS_mameCore;
    if ('undefined' != typeof EJS_biosUrl) config.biosUrl = EJS_biosUrl;
    if ('undefined' != typeof EJS_gameParentUrl) config.gameParentUrl = EJS_gameParentUrl;
    if ('undefined' != typeof EJS_gamePatchUrl) config.gamePatchUrl = EJS_gamePatchUrl;
    if ('undefined' != typeof EJS_AdUrl) config.adUrl = EJS_AdUrl;
    if ('undefined' != typeof EJS_paths) config.paths = EJS_paths;
    if ('undefined' != typeof EJS_gameID) config.gameId = EJS_gameID;
    if ('undefined' != typeof EJS_netplayUrl) config.netplayUrl = EJS_netplayUrl;
    if ('undefined' != typeof EJS_startOnLoaded) config.startOnLoad = EJS_startOnLoaded;
    if ('undefined' != typeof EJS_core) config.system = EJS_core;
    if ('undefined' != typeof EJS_oldCores) config.oldCores = EJS_oldCores;
    if ('undefined' != typeof EJS_loadStateURL) config.loadStateOnStart = EJS_loadStateURL;
    if ('undefined' != typeof EJS_defaultOptions) config.defaultMenuOptions = EJS_defaultOptions;
    if ('undefined' != typeof EJS_language) config.lang = EJS_language;
    if ('undefined' != typeof EJS_noAutoCloseAd) config.noAutoAdClose = EJS_noAutoCloseAd;
    if ('undefined' != typeof EJS_VirtualGamepadSettings) config.VirtualGamepadSettings = EJS_VirtualGamepadSettings;
    if ('undefined' != typeof EJS_Buttons) config.buttons = EJS_Buttons;
    if ('undefined' != typeof EJS_Settings) config.settings = EJS_Settings;
    if ('undefined' != typeof EJS_CacheLimit) config.cacheLimit = EJS_CacheLimit;
    config.onsavestate = null;
    config.onloadstate = null;
    if ('undefined' != typeof EJS_onSaveState) config.onsavestate = EJS_onSaveState;
    if ('undefined' != typeof EJS_onLoadState) config.onloadstate = EJS_onLoadState;
    if ('undefined' != typeof EJS_lightgun) config.lightgun = EJS_lightgun;
    if ('undefined' != typeof EJS_gameName) config.gameName = EJS_gameName;
    if ('undefined' != typeof EJS_pathtodata) config.dataPath = EJS_pathtodata;
    if ('undefined' != typeof EJS_mouse) config.mouse = EJS_mouse;
    if ('undefined' != typeof EJS_multitap) config.multitap = EJS_multitap;
    if ('undefined' != typeof EJS_playerName) config.playerName = EJS_playerName;
    if ('undefined' != typeof EJS_cheats) config.cheats = EJS_cheats;
    if ('undefined' != typeof EJS_color) config.color = EJS_color;
    window.EJS_emulator = await new EJS(EJS_player, config);
    'undefined' != typeof EJS_onGameStart && EJS_emulator.on('start-game', EJS_onGameStart);
})();
