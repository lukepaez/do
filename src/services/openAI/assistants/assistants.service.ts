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
    public retrieveAssistant = async (assistant_id: string) => {
        const assistant = await openai.beta.assistants.retrieve(assistant_id);
        return assistant;
    };

    /**
     * @description
     * @param
     * @returns
     */
    public modifyAssistant = async (
        assistant_id: string,
        instructions?: string,
        model?: string,
        name?: string,
        description?: string,
        tools?: any[],
        file_ids?: any[],
        metadata?: any
    ) => {
        const assistant = await openai.beta.assistants.update(assistant_id, {
            instructions: instructions,
            name: name,
            tools: tools,
            model: model,
            file_ids: file_ids,
        });
        return assistant;
    };

    /**
     * @description
     * @param
     * @returns
     */
    public deleteAssistant = async (assistant_id: string) => {
        const response = await openai.beta.assistants.del(assistant_id);
        return response;
    };

    /**
     * @description
     * @param
     * @returns
     */
    public listAssistants = async (
        limit?: number,
        order?: string,
        after?: string,
        before?: string
    ) => {
        const assistants = await openai.beta.assistants.list();
        return assistants;
    };
}

export const { createAssistant } = new Assistants();
