/* eslint-disable @typescript-eslint/no-non-null-assertion */
import OpenAI from 'openai';
/** Class representing OpenAI Threads API */
export class Threads {
    /**
     * @description
     * @param
     * @returns
     */
    static createThread = async () => {
        const openai = new OpenAI({
            apiKey: process.env.OPEN_API_KEY,
            organization: process.env.OPEN_AI_ORG,
        });
        const emptyThread = await openai.beta.threads.create();
        return emptyThread;
    };

    /**
     * @description
     * @param
     * @returns
     */
    static retrieveThread = async (threadId: string) => {
        const openai = new OpenAI({
            apiKey: process.env.OPEN_API_KEY,
            organization: process.env.OPEN_AI_ORG,
        });
        const myThread = await openai.beta.threads.retrieve(threadId);
        return myThread;
    };

    /**
     * @description
     * @param
     * @returns
     */
    static modifyThread = async (
        threadId: string,
        modified?: boolean,
        user?: string
    ) => {
        const openai = new OpenAI({
            apiKey: process.env.OPEN_API_KEY,
            organization: process.env.OPEN_AI_ORG,
        });
        const updatedThread = await openai.beta.threads.update(threadId, {
            metadata: { modified: modified, user: user },
        });
        return updatedThread;
    };

    /**
     * @description
     * @param
     * @returns
     */
    static deleteThread = async (threadId: string) => {
        const openai = new OpenAI({
            apiKey: process.env.OPEN_API_KEY,
            organization: process.env.OPEN_AI_ORG,
        });
        const response = await openai.beta.threads.del(threadId);
        return response;
    };
}
