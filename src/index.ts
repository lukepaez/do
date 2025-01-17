/* eslint-disable no-console */
import Fastify from 'fastify';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { initRoutes } from './routes/init.routes';
import { conversationRoutes } from './routes/conversation.routes';
import { eventRoutes } from './routes/event.route';

const swaggerOptions = {
  swagger: {
    info: {
      title: 'Do',
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
    logger: {
      transport: {
        target: 'pino-pretty',
      },
    },
  });

  // swagger
  fastify.register(fastifySwagger, swaggerOptions);
  fastify.register(fastifySwaggerUi, swaggerUi);

  // routes
  fastify.register(initRoutes);
  fastify.register(conversationRoutes);
  fastify.register(eventRoutes);
  return fastify;
};
