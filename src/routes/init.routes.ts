import { FastifyInstance, RouteShorthandOptions } from 'fastify';

export const initRoutes = (
    fastify: FastifyInstance,
    options: RouteShorthandOptions,
    done: any
) => {
    fastify.get('/health', (req: any, res: any) => {
        res.send({ status: 'healthy', route: '/health' });
    });

    done();
};
