import fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import fastifyCompress from '@fastify/compress';
import { fileURLToPath } from 'url';
const publicPath = fileURLToPath(new URL('../public/', import.meta.url));
import { createBareServer } from '@tomphttp/bare-server-node';
import { uvPath } from '@titaniumnetwork-dev/ultraviolet';

import { createServer } from 'http';
import fs from 'fs';

import Module from 'node:module';
const require = Module.createRequire(import.meta.url);

const port = process.env.PORT || 3000;

let server;

const bare = createBareServer('/bare/');

const app = fastify({ serverFactory: (handler) => {
	server = createServer((req, res) => {
		if (bare.shouldRoute(req)) {
			bare.routeRequest(req, res);
		} else {
			handler(req, res);
		}
	});

	server.on('upgrade', (req, socket, head) => {
		if (bare.shouldRoute(req)) {
			bare.routeUpgrade(req, socket, head);
		} else {
			socket.end();
		}
	});
	
	server.on('listening', () => {
		console.log(`Listening on: http://localhost:${port}`);
	});
  
	return server;
} });

app.register(
	fastifyCompress,
	{ threshold: 1 }
);

app.register(fastifyStatic, {
	root: uvPath,
	prefix: '/uv/',
	decorateReply: false,
	setHeaders: (res) => {
		res.setHeader('Service-Worker-Allowed', '/uv/service/');
	}
});
app.register(fastifyStatic, {
	root: publicPath + '/dynamic/',
	prefix: '/dynamic/',
	decorateReply: false,
	setHeaders: (res) => {
		res.setHeader('Service-Worker-Allowed', '/service/');
	}
});
app.register(fastifyStatic, {
	root: publicPath,
	prefix: '/',
	decorateReply: false,
});

const shutdown = () => {
	server.close();
	bare.close();
	process.exit(0);
};

app.get('/uv/uv.config.js', (req, res) => {
	res.type('text/javascript').send(fs.readFileSync(`${publicPath}/uv/uv.config.js`));
});

app.get('/ver', (req, res) => {
	require('child_process').exec('git rev-parse HEAD', (err1, hash) => {
		require('child_process').exec('git branch --show-current', (err2, branch) => {
			require('child_process').exec('git ls-remote --get-url', (err3, url) => {
				res.type('application/json').send({ hash: hash.replace(/\n/g, ''), branch: branch.replace(/\n/g, ''), url: url.replace(/\n/g, '')  });
			});
		});
	});
});

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

app.ready(() => {
	server.listen({ port, hostname: '127.0.0.1'  });
});
