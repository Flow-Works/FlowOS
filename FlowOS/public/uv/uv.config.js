// This file overwrites the stock UV config.js

const plain = {
	encode: (str) => {
		if (!str) return str;
		return encodeURIComponent(str);
	},
	decode: (str) => {
		if (!str) return str;
		return decodeURIComponent(str);
	},
};

self.__uv$config = {
	prefix: '/uv/service/',
	bare: '/bare/',
	encodeUrl: plain.encode,
	decodeUrl: plain.decode,
	handler: '/uv/uv.handler.js',
	client: '/uv/uv.client.js',
	bundle: '/uv/uv.bundle.js',
	config: '/uv/uv.config.js',
	sw: '/uv/uv.sw.js',
};