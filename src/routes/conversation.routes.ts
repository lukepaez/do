import OpenAI from 'openai';
import Configuration from 'openai';

export const conversationRoutes = (fastify: any, options: any, done: any) => {
    fastify.get('/conversation', (req: any, res: any) => {
        res.send({ status: 'healthy', route: '/conversation' });

        console.log(conversation());
    });

    done();
};

async function conversation() {
    const chatCompletion = await OpenAI.Chat.Completions.Create({
        messages: [{ role: 'user', content: 'Say this is a test' }],
        model: 'gpt-3.5-turbo',
    });

    return chatCompletion;
}
