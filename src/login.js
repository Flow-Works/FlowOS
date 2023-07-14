import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

const loginConfig = require('./configs/login.json');

import express from 'express';
import crypto from 'crypto';
import { QuickDB, JSONDriver  } from 'quick.db';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const router = express.Router();

const jsonDriver = new JSONDriver(`${__dirname}/db.json`);
const db = new QuickDB({ driver: jsonDriver });
const users = db.table('users');

const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

router.use(express.json());

const encrypt = (password, salt) => {
	if (!salt) salt = crypto.randomBytes(16);

	return {
		hash: crypto.createHash('sha256')
			.update(password)
			.update(makeHash(salt))
			.digest('hex'),
		salt
	};
};

const makeHash = (val) => {
    return crypto.createHash('sha256').update(val, 'utf-8').digest();
};

router.post('/login', async (req, res) => {
	if (!req.body.username || !req.body.password) res.status(400);
	const userData = await users.get(req.body.username);
	if (userData) {
		const encrypted = encrypt(req.body.password, Buffer.from(userData.salt));
		if (userData.hash == encrypted.hash) {
			res.status(200).send('Success!');
		} else {
			res.status(401).send('Username/password is incorrect.');
		}
	} else {
		res.status(401).send('Username/password is incorrect.');
	}
});

router.post('/signup', async (req, res) => {
	if (!req.body.username || !req.body.password) res.status(400);
	const userData = await users.get(req.body.username);
	if (!userData || (await users.all()).find(x => x.email === req.body.email)) {
		if (!req.body.email.match(emailRegex)) {
			res.status(422).send('Invalid email');
			return;
		}
		const encrypted = encrypt(req.body.password);
		await users.set(req.body.username, encrypted);
		await users.set(`${req.body.username}.email`, req.body.email);
		res.status(200).send('Success!');
		return;
	}
	res.status(409).send('Username is taken.');
});

export default router;