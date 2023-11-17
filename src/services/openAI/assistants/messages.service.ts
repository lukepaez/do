import OpenAI from 'openai';
import { openai } from '../../../server';
/** Class representing OpenAI Messages API */
class Messages {
    /**
     * @description
     * @param
     * @returns
     */
    public createMessage = async (
        thread_id: string,
        role: string,
        content: string
    ) => {
        const messages = await openai.beta.threads.messages.create(thread_id, {
            role: 'user',
            content: content,
        });

        return messages;
    };

    /**
     * @description
     * @param
     * @returns
     */
    public retrieveMessage = async () => {
        return true;
    };

    /**
     * @description
     * @param
     * @returns
     */
    public modifyMessage = async () => {
        return true;
    };

    /**
     * @description
     * @param
     * @returns
     */
    public listMessages = async (thread_id: string) => {
        const messages = await openai.beta.threads.messages.list(thread_id);

        return messages;
    };
}

export const { createMessage, modifyMessage, listMessages, retrieveMessage } =
    new Messages();
