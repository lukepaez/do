import { FastifyReply, FastifyRequest } from 'fastify';
import { openAi } from '../services/gpt.service';

export const createEvent = async (req: FastifyRequest, res: FastifyReply) => {
    // create event
    const event = openAi(req.body, 'gpt-3.5-turbo');

    // call gpt
    const data = await event.chatCompletionsCreate();

    // return res
    res.send(data);

    //gpt tp be called
    //provide gpt the event list
    //provide gpt the user profile prompt
    //use a system prompt to tell gpt to analyze the event list and the user profile
    //respond short to the user for immediate ack of event
    //we also want gpt to update the user's user profile prompt if necessary

    //JSON-mode?
};
