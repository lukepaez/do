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
                "You are a helpful assistant who receives information from a user in the form of individual past events that a user has accomplished. Using each new event plus the full context of the conversation, you diligently compile a json object which has two key value pairs. The first is a brief(less than 25 words) response to the user's latest event, providing encouragement and acknowledgement of the event, and considering the entire context. The second key:value in the object will be a descriptive profile of the users which upon receiving a new event asseses habits and behaviors, including any significant upcoming events or tasks, recurring behaviors, and suggestions on things for the user to do next. So, the format of the json object will be {response: 'string', profile: 'string'}.",
        });
    }

    return body;
};

export const lookupUser = () => {
    // // insert prompt
    // const messages = insertPrompt(req.body);
    // // eslint-disable-next-line no-console
    // const userIdObj = JSON.stringify(req.params);
    // // eslint-disable-next-line no-console
    // console.log(userIdObj);
    // fs.writeFile('newUser.json', userIdObj, 'utf8', function (err) {
    //     if (err) {
    //         // eslint-disable-next-line no-console
    //         console.log('An error occurred while writing JSON Object to File.');
    //         // eslint-disable-next-line no-console
    //         return console.log(err);
    //     }
    //     // eslint-disable-next-line no-console
    //     console.log('JSON file has been saved.');
    // });
};
