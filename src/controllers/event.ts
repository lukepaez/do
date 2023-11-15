/* eslint-disable no-console */
import { FastifyReply } from 'fastify';
import { Assistants } from '../services/openai/assistants/assistants.service';
import { Threads } from '../services/openai/assistants/threads.service';
import OpenAI from 'openai';
import { Messages } from '../services/openai/assistants/messages.service';
import { Runs } from '../services/openai/assistants/runs.service';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { ChatCompletionsAPI } from '../services/openai/chat.service';

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

        //console.log('\n My content: ', messages.data[0].content[0]?.text.value);

        const eventToJSON =
            messages?.data[0]?.content[0].type === 'text'
                ? messages?.data[0]?.content[0].text.value
                : null;

        const body = [
            {
                role: 'system',
                content:
                    "You are a json enforcer helping an ai assistant called DO clarify their responses. DO's goal is to examine past events entered by users and update a profile on the user at each event. DO needs help from the json enforcer(you) to make sure the output is in valid json format. Please examine this context, and enforce valid json strictly in this format: {response: 'response', profile: 'profile'}. In this first update, please do not change the 'response' or 'profile' fields, just enforce they are in json, in the specified format. ",
            },
            {
                role: 'user',
                content: JSON.stringify(eventToJSON),
            },
        ];

        //console.log('response: ', response);

        const chatObj = ChatCompletionsAPI(body, 'gpt-4-1106-preview');

        const responseInJson = await chatObj.chatCompletionsCreate();

        console.log('json mode response: ', responseInJson);

        if (responseInJson.message.content === null) {
            return new Error('bad gpt res');
        }

        const res = JSON.parse(responseInJson?.message?.content);
        responseInJson.message.content = res;
        return responseInJson;
    } catch (error) {
        console.log(error);
        return error;
    }
};

//export const completionsPass = () => {};

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
