import { FastifyInstance, RouteShorthandOptions } from 'fastify';
import { createEvent } from '../controllers/event';

// route declarations
export const eventRoutes = (
    fastify: FastifyInstance,
    options: RouteShorthandOptions,
    done: any
) => {
    // create event
    fastify.post('/event', {
        schema: {
            response: {
                200: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        index: { type: 'integer' },
                    },
                },
            },
        },
        handler: createEvent,
    });

    done();
};
