import OpenAI from 'openai';
import { ChatCompletion } from 'openai/resources/chat/completions';

export const openAi = (event: any, model: string) => {
    const modelId = model;
    const messages = event;

    const chatCompletionsCreate = async (): Promise<ChatCompletion.Choice> => {
        const openai = new OpenAI({
            apiKey: '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',
            organization: 'org-w5yYeVYCdUu1l1dijq8LArOW',
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
