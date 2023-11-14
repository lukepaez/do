import { FastifyReply, FastifyRequest } from 'fastify';
import { ChatCompletionsAPI } from '../services/openAI/chat.service';
import { insertPrompt } from '../config/helper';
import fs from 'fs';

export const createEvent = async (req: FastifyRequest, res: FastifyReply) => {
    try {
        // insert prompt
        const messages = insertPrompt(req.body);
        // eslint-disable-next-line no-console
        const userIdObj = JSON.stringify(req.params);
        // eslint-disable-next-line no-console
        console.log(userIdObj);

        fs.writeFile('newUser.json', userIdObj, 'utf8', function (err) {
            if (err) {
                // eslint-disable-next-line no-console
                console.log(
                    'An error occurred while writing JSON Object to File.'
                );
                // eslint-disable-next-line no-console
                return console.log(err);
            }
            // eslint-disable-next-line no-console
            console.log('JSON file has been saved.');
        });

        // create event
        const event = ChatCompletionsAPI(messages, 'gpt-4-1106-preview');

        // call gpt
        const data = await event.chatCompletionsCreate();

        // eslint-disable-next-line no-console
        //console.log(data);

        // return res
        res.send(data);
    } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
        return res.send(error);
    }

    //gpt tp be called
    //provide gpt the event list
    //provide gpt the user profile prompt
    //use a system prompt to tell gpt to analyze the event list and the user profile
    //respond short to the user for immediate ack of event
    //we also want gpt to update the user's user profile prompt if necessary

    //JSON-mode?
};
