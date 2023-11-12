export const conversationRoutes = (fastify: any, options: any, done: any) => {
    fastify.get('/conversation', (req: any, res: any) => {
        res.send({ status: 'healthy', route: '/conversation' });
    });

    done();
};
