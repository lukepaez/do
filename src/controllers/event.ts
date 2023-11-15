import { FastifyReply } from 'fastify';
import { Threads } from '../services/openai/assistants/threads.service';
import { Messages } from '../services/openai/assistants/messages.service';
import { Runs } from '../services/openai/assistants/runs.service';
import { db } from '../server';

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

        console.log('\n My Message: ', message);

        // create a run
        const run = await Runs.createRun(
            user.thread_id,
            process.env?.ASSISTANT_ID ? process.env.ASSISTANT_ID : ''
        );

        console.log('\n My Run: ', run);

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

        console.log('\n My messages: ', messages);

        // return response;
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
