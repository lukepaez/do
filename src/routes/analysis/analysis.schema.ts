const bodyJsonSchema = {
    type: 'object',
    properties: {
        content: { type: 'string' },
    },
};

const paramsJsonSchema = {
    type: 'object',
    properties: {
        userId: { type: 'string' },
    },
};

const headersJsonSchema = {};

export const analysisSchema = {
    body: bodyJsonSchema,
    params: paramsJsonSchema,
    headers: headersJsonSchema,
};
