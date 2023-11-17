import OpenAI from 'openai';
import { openai } from '../../../server';

/** Class representing OpenAI Assistants API */
class Assistants {
    /**
     * @description
     * @param
     * @returns
     */
    public createAssistant = async (
        instructions: string,
        name: string,
        tools: any[],
        model: string
    ) => {
        const assistant = await openai.beta.assistants.create({
            instructions: instructions,
            name: name,
            tools: tools,
            model: model,
        });
        return assistant;
    };

    /**
     * @description
     * @param
     * @returns
     */
    public retrieveAssistant = async () => {
        return true;
    };

    /**
     * @description
     * @param
     * @returns
     */
    public modifyAssistant = async () => {
        return true;
    };

    /**
     * @description
     * @param
     * @returns
     */
    public deleteAssistant = async () => {
        return true;
    };

    /**
     * @description
     * @param
     * @returns
     */
    public listAssistants = async () => {
        return true;
    };
}

export const { createAssistant } = new Assistants();
