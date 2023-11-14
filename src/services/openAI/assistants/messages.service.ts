import OpenAI from 'openai';
/** Class representing OpenAI Messages API */
export class Messages {
    // private fields
    private apiKey = process.env.OPEN_API_KEY;
    private organization = process.env.OPEN_AI_ORG;

    /**
     * @description
     * @param
     * @returns
     */
    static createMessage = async (
        thread_id: string,
        role: string,
        content: string
    ) => {
        const openai = new OpenAI({
            apiKey: process.env.OPEN_API_KEY,
            organization: process.env.OPEN_AI_ORG,
        });
        const threadMessages = await openai.beta.threads.messages.create(
            thread_id,
            {
                role: 'user',
                content: content,
            }
        );

        return threadMessages;
    };

    /**
     * @description
     * @param
     * @returns
     */
    static retrieveMessage = async () => {
        return true;
    };

    /**
     * @description
     * @param
     * @returns
     */
    static modifyMessage = async () => {
        return true;
    };

    /**
     * @description
     * @param
     * @returns
     */
    static listMessages = async (thread_id: string) => {
        const openai = new OpenAI({
            apiKey: process.env.OPEN_API_KEY,
            organization: process.env.OPEN_AI_ORG,
        });
        const threadMessages = await openai.beta.threads.messages.list(
            thread_id
        );

        return threadMessages;
    };
}
