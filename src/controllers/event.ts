/* eslint-disable no-console */
import { FastifyReply } from 'fastify';
import { Threads } from '../services/openai/assistants/threads.service';
import { Messages } from '../services/openai/assistants/messages.service';
import { Runs } from '../services/openai/assistants/runs.service';
import { ChatCompletionsAPI } from '../services/openai/chat.service';
import { db } from '../server';
import { timeStamp } from 'console';

type Data = {
    discord_id: string;
    thread_id: string;
};

type eventRequest = {
    content: string;
    userId: string;
};

export const createEvent = async (
    { content, userId }: eventRequest,
    res: FastifyReply
) => {
    try {
        // db logic here

        //timestamping user response

        const timeZone = 'EST';
        const epochTime = new Date();
        if (content) {
            content = content.concat(
                ` (time${timeZone}: `,
                epochTime.toString(),
                `)`
            );
        }

        // manage new/existing thread by user
        const user = await handleThread(userId);

        // throw error on bad db ops
        if (user instanceof Error) {
            throw user;
        }

        // create a message
        const message = await Messages.createMessage(
            user.thread_id,
            'user',
            content
        );

        //console.log('\n My Message: ', message);

        // create a run
        const run = await Runs.createRun(
            user.thread_id,
            process.env?.ASSISTANT_ID ? process.env.ASSISTANT_ID : ''
        );

        //console.log('\n My Run: ', run);

        // polling logic: TODO: refactor
        for (let i = 0; i < 3; i++) {
            await new Promise(resolve => {
                setTimeout(resolve, 3000);
                console.log('polling...');
            });
            const runStatus = await Runs.retrieveRun(user.thread_id, run.id);
            if (runStatus.status != 'completed') {
                continue;
            }
            break;
        }

        // list all messages
        const messages = await Messages.listMessages(user.thread_id);

        //console.log('\n My messages: ', messages);

        //console.log('\n My content: ', messages.data[0].content);

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

        //console.log('json mode response: ', responseInJson);

        if (responseInJson.message.content === null) {
            return new Error('bad gpt res');
        }

        const res = JSON.parse(responseInJson?.message?.content);
        responseInJson.message.content = res;
        return responseInJson;
    } catch (error) {
        return error;
    }
};

export const handleThread = async (userId: string): Promise<Data | Error> => {
    try {
        // user thread logic
        const data = await checkIfUserExists(userId)
            .then(userExists => {
                console.log('\n UserExists: ', userExists);
                if (userExists) {
                    return userExists;
                }
            })
            .catch(() => {
                return new Error('bad data from db');
            });

        if (data === undefined || data instanceof Error) {
            throw new Error('bad data from db');
        }
        return data;
    } catch (error: any) {
        return error;
    }
};

const checkIfUserExists = async (user: string): Promise<Data | Error> => {
    return new Promise((resolve, reject) => {
        db.get(
            'SELECT * FROM users WHERE discord_id = ?',
            [user],
            async (err, row: Data) => {
                if (err) {
                    console.log('\n Error checking if user in db exists.');
                    reject(err);
                }

                // new user and thread
                if (row === undefined) {
                    console.log('user does not exists.. creating thread...');
                    const thread = await Threads.createThread();
                    console.log('thread created now inserting user into db');
                    db.run(
                        `INSERT INTO users(discord_id, thread_id) VALUES(?, ?)`,
                        [user, thread.id]
                    );
                    return resolve({ discord_id: user, thread_id: thread.id });
                }

                return resolve(row);
            }
        );
    });
};

function getCurrentTimestamp() {
    return Date.now();
}
