// This file overwrites the stock UV config.js

const xor = {
	encode: (str, key=2) => {
		return encodeURIComponent(str.split('').map(e=>e.charCodeAt()).map((e,i)=>i%key?String.fromCharCode(e ^ 2) : String.fromCharCode(e)).join(''));
	}
};

self.__uv$config = {
	prefix: '/uv/service/',
	bare: '/bare/',
	encodeUrl: xor.encode,
	decodeUrl: null,
	handler: '/uv/uv.handler.js',
	client: '/uv/uv.client.js',
	bundle: '/uv/uv.bundle.js',
	config: '/uv/uv.config.js',
	sw: '/uv/uv.sw.js',
};