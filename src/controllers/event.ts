import { FastifyReply, FastifyRequest } from 'fastify';

export const createEvent = async (req: FastifyRequest, res: FastifyReply) => {
    res.send(201);

    //gpt tp be called
    //provide gpt the event list
    //provide gpt the user profile prompt
    //use a system prompt to tell gpt to analyze the event list and the user profile
    //respond short to the user for immediate ack of event
    //we also want gpt to update the user's user profile prompt if necessary

    //JSON-mode?
};
