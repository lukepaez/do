import { FastifyRequest, FastifyReply } from 'fastify';

export const getConversations = async (
    req: FastifyRequest,
    res: FastifyReply
) => {
    res.send([
        { id: 1, value: 'some_conversation' },
        { id: 2, value: 'some_conversation' },
        { id: 3, value: 'some_conversation' },
    ]);
};

export const getConversation = async (req: any, res: any) => {
    res.send({ id: 1, value: 'some_conversation' });
};

export const createConversation = async (req: any, res: any) => {
    res.send(201);
};
