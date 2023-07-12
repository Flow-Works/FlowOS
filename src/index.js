import {
	createBareServer
} from '@tomphttp/bare-server-node';
import rateLimit from 'express-rate-limit';
import express from 'express';
import session from 'cookie-session';
import csurf from 'csurf';
import {
	createServer
} from 'node:http';
import {
	uvPath
} from '@proudparrot2/uv';
import {
	join
} from 'node:path';
import {
	hostname
} from 'node:os';
import 'dotenv/config';

import {
	publicPath
} from '../FlowOS/lib/index.js';
import passwordManager from './password.js';

const bare = createBareServer('/bare/');
const app = express();

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.set('etag', false);
app.use((req, res, next) => {
	res.set('Cache-Control', 'no-store');
	next();
});

app.use('/pwd', passwordManager, limiter);

app.set('host', process.env.IP || '127.0.0.1');
app.set('port', process.env.PORT || 36000);
app.disable('x-powered-by');

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

// Load our publicPath first and prioritize it over UV.
app.use(express.static(publicPath));
// Load vendor files last.
// The vendor's uv.config.js won't conflict with our uv.config.js inside the publicPath directory.
app.use('/uv/', express.static(uvPath));

// Error for everything else
app.use((req, res) => {
	res.status(404);
	res.sendFile(join(publicPath, '404.html'));
});

const server = createServer();

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

let port = parseInt(process.env.PORT || '');

if (isNaN(port)) port = 8080;

server.on('listening', () => {
	const address = server.address();

	// by default we are listening on 0.0.0.0 (every interface)
	// we just need to list a few
	console.log('Listening on:');
	console.log(`\thttp://localhost:${address.port}`);
	console.log(`\thttp://${hostname()}:${address.port}`);
	console.log(
		`\thttp://${
      address.family === 'IPv6' ? `[${address.address}]` : address.address
    }:${address.port}`
	);
});

// https://expressjs.com/en/advanced/healthcheck-graceful-shutdown.html
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

function shutdown() {
	console.log('SIGTERM signal received: closing HTTP server');
	server.close();
	bare.close();
	process.exit(0);
}

server.listen({
	port,
});

export default app;