/* eslint-disable no-console */
import { FastifyReply } from 'fastify';
import { Assistants } from '../services/openAI/assistants/assistants.service';
import { Threads } from '../services/openAI/assistants/threads.service';
import OpenAI from 'openai';
import { Messages } from '../services/openAI/assistants/messages.service';
import { Runs } from '../services/openAI/assistants/runs.service';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';

type Data = {
    [key: string]: string;
};

const threadMap: Data = {};

export const createEvent = async (req: any, res: FastifyReply) => {
    try {
        const user = await temp(req.params.userId);

        console.log(req?.body.content);

        if (user instanceof Error) {
            return user;
        }

        //console.log('\n My user: ', user);

        const message = await Messages.createMessage(
            user[req.params.userId],
            'user',
            req?.body.content
        );

        console.log('\n My Message: ', message);

        const run = await Runs.createRun(
            user[req.params.userId],
            process.env?.ASSISTANT_ID ? process.env.ASSISTANT_ID : ''
        );

        console.log('\n My Run: ', run);

        for (let i = 0; i < 3; i++) {
            await new Promise(resolve => {
                setTimeout(resolve, 3000);
                console.log('polling...');
            });
            const runStatus = await Runs.retrieveRun(
                user[req.params.userId],
                run.id
            );
            if (runStatus.status != 'completed') {
                continue;
            }
            break;
        }

        const messages = await Messages.listMessages(user[req.params.userId]);

        console.log('\n My messages: ', messages);

        console.log('\n My content: ', messages.data[0].content);

        const response = messages.data
            .filter(msg => {
                console.log(
                    msg?.content[0].type === 'text'
                        ? msg.content[0].text.value
                        : null
                );
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
        return error;
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

export const temp = async (userId: string): Promise<Data | Error> => {
    try {
        console.log('\n My user: ', userId);
        let openAiThreadId = threadMap[userId];

        // no thread exists for user
        if (!openAiThreadId) {
            // create thread
            const thread = await Threads.createThread();
            openAiThreadId = thread.id;
            addThreadToMap(userId, openAiThreadId);
            return threadMap;
        }

        return threadMap;

        // add messages to thread
    } catch (error) {
        console.log(error);
        return new Error('bad');
    }
};

const addThreadToMap = (userId: string, threadId: string) => {
    return (threadMap[userId] = threadId);
};

const getThreadId = (userId: string) => {
    return threadMap[userId];
};
