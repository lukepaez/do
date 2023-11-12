import OpenAI from 'openai';

export const some_func = () => {
    const openai = new OpenAI({
        apiKey: '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',
        organization: 'org-w5yYeVYCdUu1l1dijq8LArOW',
    });

    const userInput = 'Hello yeepy yee!';

    agent(userInput, openai);
};

export const agent = async (userInput: any, openai: any) => {
    const messages = [
        {
            role: 'system',
            content:
                'you are yeepy yee. A chatbot named GPT 3.5 Turbo 1106, with a nickname of yeepy yee.',
        },
    ];

    messages.push({
        role: 'user',
        content: userInput,
    });

    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo-1106',
        messages: messages,
    });

    console.dir(response.choices[0]);
};
