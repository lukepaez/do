import { FastifyInstance, FastifyRequest } from 'fastify';
import { reflectionsSchema } from './reflections.schema';
import { createReflections } from '../../controllers/reflections';

export const reflectionsRoutes = async (app: FastifyInstance) => {
    app.post(
        '/reflections/:userId',
        { schema: reflectionsSchema },
        async (
            req: FastifyRequest<{
                Body: {
                    content: string;
                };
                Params: {
                    userId: string;
                };
            }>,
            res
        ) => {
            const { content } = req.body;
            const { userId } = req.params;
            const values = {
                userId: userId,
                content: content,
            };
            return createReflections(values, res);
        }
    );
};
