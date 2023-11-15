import OpenAI from 'openai';

/** Class representing OpenAI Assistants API */
export class Assistants {
    /**
     * @description
     * @param
     * @returns
     */
    static createAssistant = async (
        instructions: string,
        name: string,
        tools: any[],
        model: string
    ) => {
        const openai = new OpenAI({
            apiKey: process.env.OPEN_API_KEY,
            organization: process.env.OPEN_AI_ORG,
        });
        const myAssistant = await openai.beta.assistants.create({
            instructions: instructions,
            name: name,
            tools: tools,
            model: model,
        });
        return myAssistant;
    };

    /**
     * @description
     * @param
     * @returns
     */
    static retrieveAssistant = async () => {
        return true;
    };

    /**
     * @description
     * @param
     * @returns
     */
    static modifyAssistant = async () => {
        return true;
    };

    /**
     * @description
     * @param
     * @returns
     */
    static deleteAssistant = async () => {
        return true;
    };

    /**
     * @description
     * @param
     * @returns
     */
    static listAssistants = async () => {
        return true;
    };
}
