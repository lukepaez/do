import { FastifyReply } from 'fastify';
import { Assistants } from '../services/openai/assistants/assistants.service';
import { Threads } from '../services/openai/assistants/threads.service';
import OpenAI from 'openai';
import { Messages } from '../services/openai/assistants/messages.service';
import { Runs } from '../services/openai/assistants/runs.service';
import { db } from '../server';

type Data = {
    discord_id: string;
    thread_id: string;
};

export const createEvent = async (req: any, res: FastifyReply) => {
    try {
        // db logic here

        const user = await handleThread(req.params.userId);
        console.log(req?.body.content);

        if (user instanceof Error) {
            return user;
        }

        const message = await Messages.createMessage(
            user.thread_id,
            'user',
            req?.body.content
        );

        console.log('\n My Message: ', message);

        const run = await Runs.createRun(
            user.thread_id,
            process.env?.ASSISTANT_ID ? process.env.ASSISTANT_ID : ''
        );

        console.log('\n My Run: ', run);

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

        const messages = await Messages.listMessages(user.thread_id);

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

        const data = await checkIfUserExists(userId)
            .then(userExists => {
                console.log('\n UserExists: ', userExists);
                if (userExists) {
                    return userExists;
                }
            })
            .catch(error => {
                console.log('\n My error: ', error);
                return new Error('bad data from db');
            });

        if (data === undefined || data instanceof Error) {
            return new Error('bad data');
        }
        return data;

        // add messages to thread
    } catch (error) {
        console.log(error);
        return new Error('bad');
    }
};

const checkIfUserExists = async (user: string): Promise<Data> => {
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
