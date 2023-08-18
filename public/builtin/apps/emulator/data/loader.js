(async function () {
  const VERSION = 31.6;
  if ((window.location && ['localhost', '127.0.0.1'].includes(location.hostname)) ||
       typeof EJS_DEBUG_XX !== 'undefined' && EJS_DEBUG_XX === true) {
    fetch('https://raw.githack.com/EmulatorJS/EmulatorJS/main/data/version.json').then(response => {
      if (response.ok) {
        response.text().then(body => {
          const version = JSON.parse(body);
          if (VERSION < version.current_version) {
            console.log(`Using emulatorjs version ${VERSION} but the newest version is ${version.current_version}\nopen https://github.com/EmulatorJS/EmulatorJS to update`);
          }
        });
      }
    });
  }
  function loadStyle (file) {
    return new Promise((resolve, reject) => {
      const css = document.createElement('link');
      css.rel = 'stylesheet';
      css.href = (() => {
        if (typeof EJS_paths !== 'undefined' && typeof EJS_paths[file] === 'string') {
          return EJS_paths[file];
        } else if (typeof EJS_pathtodata === 'undefined') {
          return `${file}?v=${VERSION}`;
        } else {
          if (!EJS_pathtodata.endsWith('/')) EJS_pathtodata += '/';
          return `${EJS_pathtodata + file}?v=${VERSION}`;
        }
      })();
      css.onload = resolve;
      document.head.appendChild(css);
    });
  }
  function loadScript (file) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = (() => {
        if (typeof EJS_paths !== 'undefined' && typeof EJS_paths[file] === 'string') {
          return EJS_paths[file];
        } else if (typeof EJS_pathtodata === 'undefined') {
          return `${file}?v=${VERSION}`;
        } else {
          if (!EJS_pathtodata.endsWith('/')) EJS_pathtodata += '/';
          return `${EJS_pathtodata + file}?v=${VERSION}`;
        }
      })();
      script.onload = resolve;
      document.head.appendChild(script);
    });
  }
  if ((typeof EJS_DEBUG_XX !== 'undefined' && EJS_DEBUG_XX === true) ||
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
  if (typeof EJS_mameCore !== 'undefined') config.mameCore = EJS_mameCore;
  if (typeof EJS_biosUrl !== 'undefined') config.biosUrl = EJS_biosUrl;
  if (typeof EJS_gameParentUrl !== 'undefined') config.gameParentUrl = EJS_gameParentUrl;
  if (typeof EJS_gamePatchUrl !== 'undefined') config.gamePatchUrl = EJS_gamePatchUrl;
  if (typeof EJS_AdUrl !== 'undefined') config.adUrl = EJS_AdUrl;
  if (typeof EJS_paths !== 'undefined') config.paths = EJS_paths;
  if (typeof EJS_gameID !== 'undefined') config.gameId = EJS_gameID;
  if (typeof EJS_netplayUrl !== 'undefined') config.netplayUrl = EJS_netplayUrl;
  if (typeof EJS_startOnLoaded !== 'undefined') config.startOnLoad = EJS_startOnLoaded;
  if (typeof EJS_core !== 'undefined') config.system = EJS_core;
  if (typeof EJS_oldCores !== 'undefined') config.oldCores = EJS_oldCores;
  if (typeof EJS_loadStateURL !== 'undefined') config.loadStateOnStart = EJS_loadStateURL;
  if (typeof EJS_defaultOptions !== 'undefined') config.defaultMenuOptions = EJS_defaultOptions;
  if (typeof EJS_language !== 'undefined') config.lang = EJS_language;
  if (typeof EJS_noAutoCloseAd !== 'undefined') config.noAutoAdClose = EJS_noAutoCloseAd;
  if (typeof EJS_VirtualGamepadSettings !== 'undefined') config.VirtualGamepadSettings = EJS_VirtualGamepadSettings;
  if (typeof EJS_Buttons !== 'undefined') config.buttons = EJS_Buttons;
  if (typeof EJS_Settings !== 'undefined') config.settings = EJS_Settings;
  if (typeof EJS_CacheLimit !== 'undefined') config.cacheLimit = EJS_CacheLimit;
  config.onsavestate = null;
  config.onloadstate = null;
  if (typeof EJS_onSaveState !== 'undefined') config.onsavestate = EJS_onSaveState;
  if (typeof EJS_onLoadState !== 'undefined') config.onloadstate = EJS_onLoadState;
  if (typeof EJS_lightgun !== 'undefined') config.lightgun = EJS_lightgun;
  if (typeof EJS_gameName !== 'undefined') config.gameName = EJS_gameName;
  if (typeof EJS_pathtodata !== 'undefined') config.dataPath = EJS_pathtodata;
  if (typeof EJS_mouse !== 'undefined') config.mouse = EJS_mouse;
  if (typeof EJS_multitap !== 'undefined') config.multitap = EJS_multitap;
  if (typeof EJS_playerName !== 'undefined') config.playerName = EJS_playerName;
  if (typeof EJS_cheats !== 'undefined') config.cheats = EJS_cheats;
  if (typeof EJS_color !== 'undefined') config.color = EJS_color;
  window.EJS_emulator = await new EJS(EJS_player, config);
  typeof EJS_onGameStart !== 'undefined' && EJS_emulator.on('start-game', EJS_onGameStart);
})();
