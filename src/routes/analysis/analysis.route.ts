import { FastifyInstance, FastifyRequest } from 'fastify';
import { analysisSchema } from './analysis.schema';
import { createAnalysis } from '../../controllers/analysis';

export const analysisRoutes = async (app: FastifyInstance) => {
    app.post(
        '/analysis/:userId',
        { schema: analysisSchema },
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
            return createAnalysis(values, res);
        }
    );
};
