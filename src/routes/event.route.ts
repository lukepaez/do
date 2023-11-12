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
                        index: { type: 'integer' },
                        finish_reason: { type: 'string' },
                        message: {
                            type: 'object',
                            properties: {
                                role: { type: 'string' },
                                content: { type: 'string' },
                            },
                        },
                    },
                },
            },
        },
        handler: createEvent,
    });

    done();
};
