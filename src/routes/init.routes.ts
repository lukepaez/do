import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { schema } from '../schemas/init.schema';
export const initRoutes = async (app: FastifyInstance) => {
  app.get('/health', { schema }, async (req: FastifyRequest, res: FastifyReply) => {
    res.send({ status: 'healthy', route: '/health' });
  });
};
