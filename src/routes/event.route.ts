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
                201: {},
            },
        },
        handler: createEvent,
    });

    done();
};
