/* eslint-env browser */
/* global StompBoot */

const config = {
	bare_server: '/bare/',
	directory: '/stomp/',
	codec: StompBoot.CODEC_PLAIN
};

self.__stomp$config = {
	proxyName: 'stomp',
	prefix: config.directory,
	bare: config.bare_server,
	encodeUrl: (i) => boot.html(i).replace('/stomp/', ''),
	decodeUrl: (i) => decodeURIComponent(i.replace('process:html:', ''))
};

if (location.protocol === 'http:') {
	config.loglevel = StompBoot.LOG_TRACE;
} else {
	config.loglevel = StompBoot.LOG_ERROR;
}

const boot = new StompBoot(config);

boot.ready.catch(error => {
	console.error(error);
});