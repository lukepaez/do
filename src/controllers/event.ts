import { FastifyReply } from 'fastify';
import { Assistants } from '../services/openai/assistants/assistants.service';
import { Threads } from '../services/openai/assistants/threads.service';
import OpenAI from 'openai';
import { Messages } from '../services/openai/assistants/messages.service';
import { Runs } from '../services/openai/assistants/runs.service';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';

type Data = {
    [key: string]: string;
};

const threadMap: Data = {};

export const createEvent = async (req: any, res: FastifyReply) => {
    try {
        const user = await handleThread(req.params.userId);
        console.log(req?.body.content);

        if (user instanceof Error) {
            return user;
        }

        console.log('\n My users: ', user);

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

export const handleThread = async (userId: string): Promise<Data | Error> => {
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
