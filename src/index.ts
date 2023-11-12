import Fastify from 'fastify';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { initRoutes } from './routes/init.routes';
import { conversationRoutes } from './routes/conversation.routes';

const swaggerOptions = {
    swagger: {
        info: {
            title: 'Do API',
            description: 'Please reach out on discord @do.',
            version: '1.0.0',
        },
        host: 'localhost',
        schemes: ['http', 'https'],
        consumes: ['application/json'],
        produces: ['application/json'],
        //tags: [{ name: '', description: 'Default' }],
    },
};

const swaggerUi = {
    routePrefix: '/docs',
    exposeRoute: true,
};
// build app
export const register = () => {
    const fastify = Fastify({
        logger: true,
    });

    // swagger
    fastify.register(fastifySwagger, swaggerOptions);
    fastify.register(fastifySwaggerUi, swaggerUi);

    // init routes
    fastify.register(initRoutes);

    // conversation routes
    fastify.register(conversationRoutes);
    return fastify;
};
