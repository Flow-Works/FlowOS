/* eslint-env browser */

self.__dynamic$config = {
  prefix: '/service/',
  encoding: 'xor',
  mode: 'production', // development: zero caching, no minification, production: speed-oriented
  logLevel: 0, // 0: none, 1: errors, 2: errors + warnings, 3: errors + warnings + info
  bare: {
    version: 2, // v3 is bad
    path: '/bare/'
  },
  tab: {
    title: null,
    icon: null,
    ua: null
  },
  assets: {
    prefix: '/dynamic/',
    files: {
      handler: 'dynamic.handler.js',
      client: 'dynamic.client.js',
      worker: 'dynamic.worker.js',
      config: 'dynamic.config.js',
      inject: null
    }
  },
  block: [

  ]
};

self.xor = {
  randomMax: 100,
  randomMin: -100,

  encode: (str) => {
    if (!str) return str;
    return encodeURIComponent(
      str
        .toString()
        .split('')
        .map((char, ind) =>
          ind % 2 ? String.fromCharCode(char.charCodeAt() ^ 2) : char
        )
        .join('')
    );
  },
  decode: (str) => {
    if (!str) return str;
    const [input, ...search] = str.split('?');

    return (
      decodeURIComponent(input)
        .split('')
        .map((char, ind) =>
          ind % 2 ? String.fromCharCode(char.charCodeAt(0) ^ 2) : char
        )
        .join('') + (search.length ? '?' + search.join('?') : '')
    );
  }
};

self.__dyn$config = {
  proxyName: 'dyn',
  prefix: self.__dynamic$config.prefix,
  encodeUrl: xor.encode,
  decodeUrl: xor.decode
};
