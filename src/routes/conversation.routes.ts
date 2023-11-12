import { FastifyInstance, RouteShorthandOptions } from 'fastify';
import {
    createConversation,
    getConversation,
    getConversations,
} from '../controllers/conversations';

// route declarations
export const conversationRoutes = (
    fastify: FastifyInstance,
    options: RouteShorthandOptions,
    done: any
) => {
    // get all conversations
    fastify.get('/conversations', {
        schema: {
            response: {
                200: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'integer' },
                            value: { type: 'string' },
                        },
                    },
                },
            },
        },
        handler: getConversations,
    });

    // get unique conversation
    fastify.get('/conversation:id', {
        schema: {
            response: {
                200: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        value: { type: 'string' },
                    },
                },
            },
        },
        handler: getConversation,
    });

    // create conversation
    fastify.post('/conversations', {
        schema: {
            response: {
                201: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        value: { type: 'string' },
                    },
                },
            },
        },
        handler: createConversation,
    });

    done();
};
