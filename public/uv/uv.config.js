const key = btoa(navigator.userAgent + navigator.language);

const plain = {
    encode: (str) => {
        if (!str) return str;
        let xorResult = '';
        for(let i = 0; i < str.length; i++) {
            xorResult += String.fromCharCode(str.charCodeAt(i) ^ key.charCodeAt(i % key.length));
        }
        let base64Result = btoa(xorResult);
        return base64Result;
    },
    decode: (str) => {
        if (!str) return str;
        let base64Decoded;
        try {
            base64Decoded = atob(str);
        } catch (e) {
            console.error('Failed to decode base64 string');
            return str; // or handle the error as you see fit
        }
        let result = '';
        for(let i = 0; i < base64Decoded.length; i++) {
            result += String.fromCharCode(base64Decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length));
        }
        return result;
    },
};

self.__uv$config = {
	proxyName: 'uv',
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