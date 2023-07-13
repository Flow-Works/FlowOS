import {
	createBareServer
} from '@tomphttp/bare-server-node';
import rateLimit from 'express-rate-limit';
import express from 'express';
import session from 'cookie-session';
import csurf from 'csurf';
import compression from 'compression';
import {
	createServer
} from 'node:http';
import {
	uvPath
} from '@proudparrot2/uv';
import {
	join
} from 'node:path';
import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
	dotenv.config();
}

import {
	publicPath
} from '../FlowOS/lib/index.js';
import passwordManager from './password.js';

const bare = createBareServer('/bare/');
const app = express();
const server = createServer();

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.set('host', process.env.IP || '127.0.0.1');
app.set('port', process.env.PORT || 3000);
app.disable('x-powered-by');

app.use(compression({ filter: shouldCompress }));
function shouldCompress (req, res) {
	if (req.headers['x-no-compression']) {
	  return false;
	}

	return compression.filter(req, res);
}

app.use((req, res, next) => {
	res.setHeader('Cache-Control', 'public, s-maxage=3600');
	next();
});

app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SECRET,
    cookie: {
		httpOnly: true,
		secure: true
	}
}));

app.use(csurf());

app.use(express.static(publicPath));
app.use('/pwd/', passwordManager, limiter);
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
	const address = server.address();

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