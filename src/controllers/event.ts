import { FastifyReply } from 'fastify';
import { Assistants } from '../services/openAI/assistants/assistants.service';
import { Threads } from '../services/openAI/assistants/threads.service';
import OpenAI from 'openai';
import { Messages } from '../services/openAI/assistants/messages.service';
import { Runs } from '../services/openAI/assistants/runs.service';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import map from './map.json';

export const createEvent = async (req: any, res: FastifyReply) => {
    try {
        const assistant = await Assistants.createAssistant(
            'You are a personal grammar coach. Evaluate my text and sugguest a one sentence critique on how to make it more gramatically correct.',
            'Grammy',
            [],
            'gpt-4-1106-preview'
        );

        console.log('\n My Assistant: ', assistant);

        const thread = await Threads.createThread();

        console.log('\n My Thread: ', thread);

        const alive = insertUser(thread.id);

        const message = await Messages.createMessage(
            thread.id,
            'user',
            req.body?.content
        );

        console.log('\n My Message: ', message);

        const run = await Runs.createRun(thread.id, assistant.id);

        console.log('\n My Run: ', run);

        for (let i = 0; i < 3; i++) {
            await new Promise(resolve => {
                setTimeout(resolve, 3000);
                console.log('polling...');
            });
            const runStatus = await Runs.retrieveRun(thread.id, run.id);
            if (runStatus.status != 'completed') {
                continue;
            }
            break;
        }

        const messages = await Messages.listMessages(thread.id);

        const response = messages.data
            .filter(msg => {
                return msg.run_id === run.id && msg.role === 'assistant';
            })
            .pop();
        res.send({
            id:
                response?.content[0].type === 'text'
                    ? response.content[0].text.value
                    : null,
            index: 0,
        });
    } catch (error) {
        console.log(error);
    }

    // // insert prompt
    // const messages = insertPrompt(req.body);

    // // create event
    // const event = ChatCompletionsAPI(messages, 'gpt-4-1106-preview');

    // // call gpt
    // const data = await event.chatCompletionsCreate();

    // // eslint-disable-next-line no-console
    // console.log(data);

    // // return res
    // res.send(data);

    // //gpt tp be called
    // //provide gpt the event list
    // //provide gpt the user profile prompt
    // //use a system prompt to tell gpt to analyze the event list and the user profile
    // //respond short to the user for immediate ack of event
    // //we also want gpt to update the user's user profile prompt if necessary

    // //JSON-mode?
};

export const insertUser = (thread_id: string) => {
    type Data = {
        user: number;
        thread_id: string;
    };

    const old = readFileSync(path.resolve(__dirname, './map.json'), 'utf-8');

    const json: Data[] = JSON.parse(old);
    console.log('\n My json data: ', json);
    if (!json.length) {
        json.push({ user: 1, thread_id: thread_id });
        const newJson = JSON.stringify(json);
        writeFileSync(path.resolve(__dirname, './map.json'), newJson, 'utf-8');
        return true;
    }

    for (const obj of json) {
        if (obj.thread_id === thread_id) {
            return true;
        }
    }

    return false;
};
