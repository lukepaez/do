import { FastifyInstance, FastifyRequest } from 'fastify';
import { createEvent } from '../controllers/event';
import { eventSchema } from '../schemas/event.schema';

export const eventRoutes = async (app: FastifyInstance) => {
  app.post(
    '/event/:userId',
    { schema: eventSchema },
    async (
      req: FastifyRequest<{
        Body: {
          content: string;
        };
        Params: {
          userId: string;
        };
      }>,
      res,
    ) => {
      const { content } = req.body;
      const { userId } = req.params;
      const values = {
        userId: userId,
        content: content,
      };
      return createEvent(values, res);
    },
  );
};
