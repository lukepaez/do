export const insertPrompt = (body: any) => {
    if (!body) {
        return;
    }

    if (Array.isArray(body) && body.length) {
        if (body[0]?.role === 'system') {
            return;
        }

        body.unshift({
            role: 'system',
            content:
                'You are a helpful assistant who receives information from a user in the form of individual past events that a user has accomplished. Using each new event plus the full context of the conversation, you diligently compile a descriptive profile of the users which upon receiving a new event asseses habits and behaviors, including any significant upcoming events or tasks, recurring behaviors, and suggestions on things for the user to do next.',
        });
    }

    return body;
};
