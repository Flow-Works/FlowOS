import { Configuration, OpenAIApi } from 'openai';
import 'dotenv/config';

const configuration = new Configuration({
  apiKey: process.env.API_KEY,
  basePath: 'https://chimeragpt.adventblocks.cc/v1'
});

const openai = new OpenAIApi(configuration);

const ai = (app, opts, done) => {
    app.addContentTypeParser('application/json', { parseAs: 'string' }, (req, body, done) => {
        try {
            const json = JSON.parse(body);
            done(null, json);
        } catch (err) {
            err.statusCode = 400;
            done(err, undefined);
        }
    });

    app.post('/chat', async (req, res) => {
        const chatCompletion = await openai.createChatCompletion({
            model: req.body.model,
            messages: req.body.logs,
        });
        return res.type('application/json').send(chatCompletion.data.choices[0].message);
    });

    done();
};

export default ai;