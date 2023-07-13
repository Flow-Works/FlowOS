import express from 'express';
import crypto from 'crypto';
import cache from 'memory-cache';

const router = express.Router();

const key = Buffer.from(String(process.env.KEY), 'hex');
const iv = Buffer.from(String(process.env.IV), 'hex');

function encrypt(plainText) {
	var mystr = crypto.createHash('sha256').update(plainText).update(makeHash(process.env.SALT)).digest('hex');
	return mystr;
}

const cacheMiddleware = (req, res, next) => {
	const cache_key = '__express__' + req.originalUrl || req.url;
	const cachedData = cache.get(cache_key);
  
	if (cachedData) {
	  	res.send(cachedData);
	  	return;
	}
  
	res.sendResponse = res.send;
	res.send = (body) => {
	  	const durationInMilliseconds = 5 * 60 * 1000;
	  	cache.put(cache_key, body, durationInMilliseconds);
	  	res.sendResponse(body);
	};
  
	next();
};

function makeHash(val) {
    return crypto.createHash('sha256').update(val, 'utf-8').digest();
}
  

router.get('/encrypt', cacheMiddleware, (req, res) => {
	const enc = encrypt(req.query.password);
	res.setHeader('Content-Type', 'text/plain');
	res.send(enc);
});

router.get('/verify', cacheMiddleware, (req, res) => {
	const enc = encrypt(req.query.input);
	res.setHeader('Content-Type', 'text/plain');
	res.send(enc == req.query.hash);
});

export default router;