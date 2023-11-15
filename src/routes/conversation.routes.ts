import { FastifyInstance } from 'fastify';

export const conversationRoutes = async (app: FastifyInstance) => {
    app.post('/conversation', async (req, res) => {
        res.status(400);
    });
};
