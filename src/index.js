import dotenv from 'dotenv';

import express from 'express';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import minify from 'express-minify';
import acceptWebp from 'accept-webp';

import { createBareServer } from '@tomphttp/bare-server-node';
import { createServer } from 'node:http';
import { uvPath } from '@proudparrot2/uv';
import { join } from 'node:path';

import { publicPath } from '../FlowOS/lib/index.js';
import passwordRouter from './password.js';

dotenv.config();

const bare = createBareServer('/bare/');
const app = express();
const server = createServer();

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 100,
	standardHeaders: true,
	legacyHeaders: false,
});

app.set('host', process.env.IP || '127.0.0.1');
app.set('port', process.env.PORT || 3000);
app.disable('x-powered-by');

app.use(compression({ filter: shouldCompress }));
app.use(minify());
function shouldCompress (req, res) {
	if (req.headers['x-no-compression']) {
	  return false;
	}

	return compression.filter(req, res);
}

app.use((req, res, next) => {
	res.setHeader('Cache-Control', 'maxage=2592000');
	next();
});

app.use(acceptWebp(publicPath, ['jpg', 'jpeg', 'png']));

app.use(express.static(publicPath));
app.use('/pwd/', passwordRouter, limiter);
app.use('/uv/', express.static(uvPath));

app.use((req, res) => {
	res.status(404);
	res.sendFile(join(publicPath, '404.html'));
});

server.on('request', (req, res) => {
	if (bare.shouldRoute(req)) {
		bare.routeRequest(req, res);
	} else {
		app(req, res);
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
	console.log(`Listening on: http://localhost:${app.get('port')}`);
});

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

function shutdown() {
	server.close();
	bare.close();
	process.exit(0);
}

server.listen({
	port: app.get('port'),
});