/* eslint-disable @typescript-eslint/no-non-null-assertion */
import OpenAI from 'openai';
import { openai } from '../../../server';
/** Class representing OpenAI Threads API */
class Threads {
    /**
     * @description
     * @param
     * @returns
     */
    public createThread = async () => {
        const thread = await openai.beta.threads.create();
        return thread;
    };

    /**
     * @description
     * @param
     * @returns
     */
    public retrieveThread = async (threadId: string) => {
        const thread = await openai.beta.threads.retrieve(threadId);
        return thread;
    };

    /**
     * @description
     * @param
     * @returns
     */
    public modifyThread = async (
        threadId: string,
        modified?: boolean,
        user?: string
    ) => {
        const thread = await openai.beta.threads.update(threadId, {
            metadata: { modified: modified, user: user },
        });
        return thread;
    };

    /**
     * @description
     * @param
     * @returns
     */
    public deleteThread = async (threadId: string) => {
        const thread = await openai.beta.threads.del(threadId);
        return thread;
    };
}

export const { createThread, deleteThread, retrieveThread, modifyThread } =
    new Threads();
