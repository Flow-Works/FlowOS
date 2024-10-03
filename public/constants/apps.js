import { AppData } from "../scripts/classes.js";
import { config } from "../scripts/managers.js";

const apps = () => {
	return {
		info: new AppData(
			"info",
			"About",
			"/builtin/apps/about.html",
			"/assets/icons/info.svg",
			false,
			{
				width: "300px",
				height: "500px",
				class: ["no-resize", "no-max", "no-full"],
			},
		),
		settings: new AppData(
			"settings",
			"Settings",
			"/builtin/apps/settings.html",
			"/assets/icons/settings.svg",
			false,
		),
		browser: new AppData(
			"browser",
			"Browser",
			"/builtin/apps/browser/index.html",
			"/assets/icons/browser.svg",
			false,
		),
		"app-wizard": new AppData(
			"app-wizard",
			"Custom Apps",
			"/builtin/apps/app-wizard.html",
			"/assets/icons/appeditor.svg",
			false,
		),
		games: new AppData(
			"games",
			"Games",
			"/builtin/apps/games/3kh0-lite-main/index.html",
			"/assets/icons/gamehub.svg",
			false,
		),
		media: new AppData(
			"media",
			"Media Center",
			"/builtin/apps/media.html",
			"/assets/icons/playmyvideos.svg",
			false,
		),
		css: new AppData(
			"css",
			"CSS Editor",
			"/builtin/apps/css.html",
			"/assets/icons/terminal.svg",
			false,
			{
				width: "750px",
				height: "500px",
				class: ["no-resize", "no-max", "no-full"],
			},
		),
		terminal: new AppData(
			"terminal",
			"Terminal",
			"/builtin/apps/terminal.html",
			"/assets/icons/terminal.svg",
			false,
		),
		...config.apps.get(),
		...config.customApps.get(),
	};
};

export default apps;
