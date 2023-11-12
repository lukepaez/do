import { Configuration, OpenAIApi } from 'openai';

OPENAI_API_KEY = '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';

export const conversationRoutes = (fastify: any, options: any, done: any) => {
    fastify.get('/conversation', (req: any, res: any) => {
        res.send({ status: 'healthy', route: '/conversation' });
    });

    done();
};

const configuration = new Configuration({
    organization: 'org-w5yYeVYCdUu1l1dijq8LArOW',
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
const response = await openai.listEngines();

console.log(response.data);
