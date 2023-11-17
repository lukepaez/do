import OpenAI from 'openai';
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
        instructions?: string
    ) => {
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
    public retrieveRun = async (thread_id: string, run_id: string) => {
        const run = await openai.beta.threads.runs.retrieve(thread_id, run_id);

        return run;
    };

    /**
     * @description
     * @param
     * @returns
     */
    public modifyRun = async () => {
        return true;
    };

    /**
     * @description
     * @param
     * @returns
     */
    public listRuns = async () => {
        return true;
    };

    /**
     * @description
     * @param
     * @returns
     */
    public cancelRun = async () => {
        return true;
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
