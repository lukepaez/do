export const initRoutes = (fastify: any, options: any, done: any) => {
    fastify.get('/health', (req: any, res: any) => {
        res.send({ status: 'healthy', route: '/health' });
    });

    done();
};
