import fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import fastifyCompress from '@fastify/compress';
import fastifyCaching from '@fastify/caching';

import { createBareServer } from '@tomphttp/bare-server-node';
import { uvPath } from '@proudparrot2/uv';
import { publicPath } from '../FlowOS/lib/index.js';

import { createServer } from 'http2';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const port = process.env.PORT || 3000;

let server;

const bare = createBareServer('/bare/');

const app = fastify({ http2: true, serverFactory: (handler) => {
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

const __dirname = dirname(fileURLToPath(import.meta.url));

app.register(fastifyCompress);
app.register(
    fastifyCaching,
    { privacy: fastifyCaching.privacy.PUBLIC, expiresIn: 31536000 },
);

app.register(fastifyStatic, {
	root: uvPath,
	prefix: '/uv/',
	decorateReply: false,
	setHeaders: (res, path, stat) => {
		res.setHeader('Service-Worker-Allowed', '/uv/service/');
	}
});
app.register(fastifyStatic, {
	root: publicPath,
	prefix: '/',
	decorateReply: false,
});
app.register(fastifyStatic, {
	root: join(__dirname, '/emulator'),
	prefix: '/emu/',
	decorateReply: false,
});

const shutdown = () => {
	server.close();
	bare.close();
	process.exit(0);
};

app.get('/uv/uv.config.js', (req, res) => {
	res.header('Service-Worker-Allowed', '/uv/service/');
	res.type('text/javascript').send(fs.readFileSync(publicPath + '/uv/uv.config.js'));
});

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

app.ready(() => {
	server.listen({ port });
});