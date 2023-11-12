import OpenAI from 'openai';
import { ChatCompletion } from 'openai/resources/chat/completions';

export const openAi = (event: any, model: string) => {
    const modelId = model;
    const messages = event;

    const chatCompletionsCreate = async (): Promise<ChatCompletion.Choice> => {
        const openai = new OpenAI({
            apiKey: process.env.OPEN_API_KEY,
            organization: process.env.OPEN_AI_ORG,
        });

        const completion = await openai.chat.completions.create({
            messages: messages,
            model: modelId,
        });

        return completion.choices[0];
    };

    return {
        chatCompletionsCreate,
    };
};
