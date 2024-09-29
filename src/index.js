import express from 'express';
import wisp from 'wisp-server-node';

import { uvPath } from '@titaniumnetwork-dev/ultraviolet';
import { epoxyPath } from '@mercuryworkshop/epoxy-transport';
import { baremuxPath } from '@mercuryworkshop/bare-mux/node';

import { exec } from 'child_process';

import { createServer } from 'http';
import fs from 'fs';

import Module from 'node:module';

const publicPath = './public';

const port = process.env.PORT || 8080;

const app = express();
const server = createServer(app);

app.use('/', express.static(publicPath));
app.use('/uv/', express.static(uvPath));
app.use('/epoxy/', express.static(epoxyPath));
app.use('/baremux/', express.static(baremuxPath));

// Add a route handler for the root path
app.get('/', (req, res) => {
  res.send('Welcome to the Fastify server!');
});

app.get('/uv/uv.config.js', (req, res) => {
  res.type('text/javascript').send(fs.readFileSync(`${publicPath}/uv/uv.config.js`));
});

app.get('/ver', (req, res) => {
  exec('git rev-parse HEAD', (err1, hash) => {
    exec('git branch --show-current', (err2, branch) => {
      exec('git ls-remote --get-url', (err3, url) => {
        res.type('application/json').send({ hash: hash.replace(/\n/g, ''), branch: branch.replace(/\n/g, ''), url: url.replace(/\n/g, '') });
      });
    });
  });
});

server.on('upgrade', (req, socket, head) => {
  wisp.routeRequest(req, socket, head);
});

server.on('listening', () => {
  console.log(`Listening on: http://localhost:${port}`);
});

server.listen({ port, hostname: '127.0.0.1' });
