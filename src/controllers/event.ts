import { FastifyReply } from 'fastify';
import { Assistants } from '../services/openAI/assistants/assistants.service';
import { Threads } from '../services/openAI/assistants/threads.service';
import OpenAI from 'openai';
import { Messages } from '../services/openAI/assistants/messages.service';
import { Runs } from '../services/openAI/assistants/runs.service';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';

type Data = {
    userId: string;
    thread_id: string;
    assistant_id: string;
};

export const createEvent = async (req: any, res: FastifyReply) => {
    try {
        // create assistant
        const assistant = await Assistants.createAssistant(
            'You are a personal grammar coach. Evaluate my text and sugguest a one sentence critique on how to make it more gramatically correct.',
            'Grammy',
            [],
            'gpt-4-1106-preview'
        );

        console.log('\n My Assistant: ', assistant.id);

        const thread = await Threads.createThread();

        console.log('\n My Thread: ', thread);

        const message = await Messages.createMessage(
            thread.id,
            'user',
            req?.body.content
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
};

// does user exist?
// yes: does thread exist
//no: insert new thread
// no: insert new user and new thread
export const insertUser = async (userId: string, content: string) => {
    const old = readFileSync(
        path.resolve(__dirname, '../../users.json'),
        'utf-8'
    );

    const json: Data[] = JSON.parse(old);

    if (!json.length) {
        // create assistant
        const assistant = await Assistants.createAssistant(
            'You are a personal grammar coach. Evaluate my text and sugguest a one sentence critique on how to make it more gramatically correct.',
            'Grammy',
            [],
            'gpt-4-1106-preview'
        );

        console.log('\n My Assistant: ', assistant);

        const thread = await Threads.createThread();

        console.log('\n My Thread: ', thread);

        const message = await Messages.createMessage(
            thread.id,
            'user',
            content
        );

        console.log('\n My Message: ', message);

        const user: Data = {
            userId: userId,
            thread_id: thread.id,
            assistant_id: assistant.id,
        };

        // first user
        json.push(user);
        const newJson = JSON.stringify(json);
        writeFileSync(path.resolve(__dirname, './map.json'), newJson, 'utf-8');
        return user;
    }

    // list users
    for (const obj of json) {
        // if user exists
        if (obj.userId === userId) {
            // if thread exists
            // eslint-disable-next-line no-prototype-builtins
            if (obj.hasOwnProperty('thread_id') && obj.thread_id != '') {
                return obj;
            }
        }
    }
};
