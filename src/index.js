import fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import fastifyCompress from '@fastify/compress';

import { createBareServer } from '@tomphttp/bare-server-node';
import { stompPath } from '@sysce/stomp';
import { uvPath } from '@proudparrot2/uv';
import { publicPath } from '../FlowOS/lib/index.js';

import { createServer } from 'http';
import fs from 'fs';

import ai from './ai.js';

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

app.register(ai, { prefix: '/ai/' });

app.register(fastifyStatic, {
	root: uvPath,
	prefix: '/uv/',
	decorateReply: false,
	setHeaders: (res) => {
		res.setHeader('Service-Worker-Allowed', '/uv/service/');
	}
});
app.register(fastifyStatic, {
	root: stompPath,
	prefix: '/stomp/',
	decorateReply: false,
	setHeaders: (res) => {
		res.setHeader('Service-Worker-Allowed', '/stomp/');
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

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

app.ready(() => {
	server.listen({ port });
});