import OpenAI from 'openai';
/** Class representing OpenAI Runs API */
export class Runs {
    // private fields
    private apiKey = process.env.OPEN_API_KEY;
    private organization = process.env.OPEN_AI_ORG;

    /**
     * @description
     * @param
     * @returns
     */
    static createRun = async (
        thread_id: string,
        assistant_id: string,
        instructions?: string
    ) => {
        const openai = new OpenAI({
            apiKey: process.env.OPEN_API_KEY,
            organization: process.env.OPEN_AI_ORG,
        });
        const run = await openai.beta.threads.runs.create(thread_id, {
            assistant_id: assistant_id,
            instructions: instructions,
        });

        return run;
    };

    /**
     * @description
     * @param
     * @returns
     */
    static retrieveRun = async (thread_id: string, run_id: string) => {
        const openai = new OpenAI({
            apiKey: process.env.OPEN_API_KEY,
            organization: process.env.OPEN_AI_ORG,
        });
        const run = await openai.beta.threads.runs.retrieve(thread_id, run_id);

        return run;
    };

    /**
     * @description
     * @param
     * @returns
     */
    static modifyRun = async () => {
        return true;
    };

    /**
     * @description
     * @param
     * @returns
     */
    static listRuns = async () => {
        return true;
    };

    /**
     * @description
     * @param
     * @returns
     */
    static cancelRun = async () => {
        return true;
    };

    /**
     * @description
     * @param
     * @returns
     */
    static createThreadRun = async () => {
        return true;
    };
}
