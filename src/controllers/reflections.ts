/* eslint-disable no-console */
import { FastifyReply } from 'fastify';
import { ChatCompletionsAPI } from '../services/openai/chat/chat.service';
import { db, openai } from '../server';
import { timeStamp } from 'console';
import {
    createMessage,
    listMessages,
} from '../services/openai/assistants/messages.service';
import {
    createRun,
    retrieveRun,
} from '../services/openai/assistants/runs.service';
import { createThread } from '../services/openai/assistants/threads.service';
import { ThreadMessagesPage } from 'openai/resources/beta/threads/messages/messages';
import { APIClient } from 'openai/core';
import OpenAI from 'openai';
import { threadId } from 'node:worker_threads';

type Data = {
    discord_id: string;
    thread_id: string;
};

type eventRequest = {
    content: string;
    userId: string;
};

export const createReflections = async (
    { content, userId }: eventRequest,
    res: FastifyReply
) => {
    try {
        // db logic here

        //timestamping user response

        const epochTime = new Date();
        if (content) {
            content = content.concat(` (time: `, epochTime.toString(), `)`);
        }

        // manage new/existing thread by user
        const user = await handleThread(userId);

        // throw error on bad db ops
        if (user instanceof Error) {
            throw user;
        }

        let allMessages: any[] = [];
        try {
            let hasMore = true;
            let afterId = null;

            while (hasMore) {
                const options: {
                    limit: number;
                    order: 'desc' | 'asc' | undefined;
                    after?: string | undefined;
                } = {
                    limit: 20, // You can adjust this number as needed
                    order: 'desc', // Or 'asc', depending on your requirement
                };

                if (afterId) {
                    options.after = afterId;
                }

                const response = await openai.beta.threads.messages.list(
                    user.thread_id,
                    options
                );

                const messages = response.data;
                if (messages && messages.length > 0) {
                    allMessages = allMessages.concat(messages);
                    afterId = messages[messages.length - 1].id;
                } else {
                    hasMore = false;
                }
            }

            console.log('All messages:', allMessages);
        } catch (error) {
            console.error('Error:', error);
        }

        const userModifier = content;

        const body = [
            {
                role: 'system',
                content: `You are a meticulous categorizer and insightful analyzer, adept at discerning and classifying patterns in user behavior and activities. Your task is enhanced by the specific user modifier "${userModifier}", pivotal for customizing the interaction to cater to the user's immediate state or needs. In the absence of a user modifier, your analysis will still leverage the extensive interaction history and profile data to deliver structured insights into the user's habits and preferences.

                For each insight, categorize them under specific headings, such as development, learning, hobbies, moods, tasks, connections, personal relationships, realizations, etc. If an insight fits multiple categories, list it under all applicable ones.
                
                Format each categorized insight as follows: "category: 'insight detail'". Provide a succinct yet comprehensive explanation for each categorized insight. Your analysis should weave together a narrative that is both predictive and personalized, focusing on categorizing user interactions into meaningful segments. This structured approach will significantly contribute to "Do."'s evolution, enhancing its capability for intelligent foresight and nuanced understanding through clear categorization.`,
            },
            {
                role: 'user',
                content: JSON.stringify(allMessages),
            },
        ];

        //console.log('response: ', response);

        const chatObj = ChatCompletionsAPI(
            body,
            'gpt-4-1106-preview',
            'reflections'
        );

        const responseInJson = await chatObj.chatCompletionsCreate();

        console.log('json mode response: ', responseInJson);

        if (responseInJson.message.content === null) {
            return new Error('bad gpt res');
        }

        const res = responseInJson?.message?.content;
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
                    const thread = await createThread();
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

//TODO:: Modularize
//function getFullThread()
