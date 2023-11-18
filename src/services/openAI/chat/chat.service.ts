import OpenAI from 'openai';
import { ChatCompletion } from 'openai/resources/chat/completions';

export const ChatCompletionsAPI = (event: any, model: string, mode: string) => {
    const modelId = model;
    const messages = event;
    const responseMode = mode;
    let responseType: 'text' | 'json_object' | undefined;

    if (responseMode === 'reflections' || responseMode === 'analysis') {
        responseType = 'text';
    } else {
        responseType = 'json_object';
    }

    const chatCompletionsCreate = async (): Promise<ChatCompletion.Choice> => {
        const openai = new OpenAI({
            apiKey: process.env.OPEN_API_KEY,
            organization: process.env.OPEN_AI_ORG,
        });

        const completion = await openai.chat.completions.create({
            messages: messages,
            response_format: { type: responseType },
            model: modelId,
        });

        return completion.choices[0];
    };

    return {
        chatCompletionsCreate,
    };
};
