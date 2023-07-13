import express from 'express';
import crypto from 'crypto';
import cache from 'memory-cache';

const router = express.Router();

const key = Buffer.from(String(process.env.KEY), 'hex');
const iv = Buffer.from(String(process.env.IV), 'hex');

function encrypt(plainText) {
	var mykey = crypto.createCipheriv('aes-128-gcm', key, iv);
	var mystr = mykey.update(plainText, 'utf8', 'hex');
	mystr += mykey.final('hex');
	return mystr;
}

function decrypt(cipherText) {
	var mykey = crypto.createDecipheriv('aes-128-gcm', key, iv);
	var mystr = mykey.update(cipherText, 'hex', 'utf8');
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
  

router.get('/encrypt', cacheMiddleware, (req, res) => {
	const enc = encrypt(req.query.password);
	res.setHeader('Content-Type', 'text/plain');
	res.send(enc);
});

router.get('/verify', cacheMiddleware, (req, res) => {
	const dec = decrypt(req.query.aes);
	res.setHeader('Content-Type', 'text/plain');
	res.send(dec == req.query.input);
});

export default router;