import Fastify from 'fastify';
import { initRoutes } from './routes/init.routes';
import { conversationRoutes } from './routes/conversation.routes';

// build app
export const register = () => {
    const fastify = Fastify({
        logger: true,
    });

    // init routes
    fastify.register(initRoutes);

    // conversation routes
    fastify.register(conversationRoutes);
    return fastify;
};
