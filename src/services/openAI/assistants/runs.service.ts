import { openai } from '../../../server';
/** Class representing OpenAI Runs API */
class Runs {
    /**
     * @description
     * @param
     * @returns
     */
    public createRun = async (
        thread_id: string,
        assistant_id: string,
        instructions?: string,
        model?: string,
        tools?: any[],
        metadata?: object
    ) => {
        const run = await openai.beta.threads.runs.create(thread_id, {
            assistant_id: assistant_id,
            instructions: instructions,
            model: model,
            tools: tools,
            metadata: metadata,
        });

        return run;
    };

    /**
     * @description
     * @param
     * @returns
     */
    public retrieveRun = async (thread_id: string, run_id: string) => {
        const run = await openai.beta.threads.runs.retrieve(thread_id, run_id);

        return run;
    };

    /**
     * @description
     * @param
     * @returns
     */
    public modifyRun = async (
        thread_id: string,
        run_id: string,
        metadata?: object
    ) => {
        const run = await openai.beta.threads.runs.update(thread_id, run_id, {
            metadata: metadata,
        });
        return run;
    };

    /**
     * @description
     * @param
     * @returns
     */
    public listRuns = async (thread_id: string) => {
        const runs = await openai.beta.threads.runs.list(thread_id);
        return runs;
    };

    /**
     * @description
     * @param
     * @returns
     */
    public cancelRun = async (thread_id: string, run_id: string) => {
        const run = await openai.beta.threads.runs.cancel(thread_id, run_id);
        return run;
    };

    /**
     * @description
     * @param
     * @returns
     */
    public createThreadRun = async () => {
        return true;
    };
}

export const {
    createRun,
    retrieveRun,
    listRuns,
    cancelRun,
    createThreadRun,
    modifyRun,
} = new Runs();
