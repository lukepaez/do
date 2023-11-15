import { FastifyInstance } from 'fastify';
import { createEvent } from '../controllers/event';

export const eventRoutes = async (app: FastifyInstance) => {
    app.post('/event/:userId', {}, async (req, res) => {
        return createEvent(req, res);
    });
};
