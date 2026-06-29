import type { Policy } from './policy';

/**
 * Tracks per-task spend (model round-trips + tool invocations) and enforces the
 * policy's hard caps. This is what makes autonomy *bounded* rather than blind: when a
 * budget is exhausted the caller stops instead of looping forever.
 */
export class Budget {
    private llm = 0;
    private tools = 0;

    constructor(private readonly policy: Pick<Policy, 'maxLlmCallsPerTask' | 'maxToolCallsPerTask'>) {}

    canCallLlm(): boolean {
        return this.llm < this.policy.maxLlmCallsPerTask;
    }

    canCallTool(): boolean {
        return this.tools < this.policy.maxToolCallsPerTask;
    }

    recordLlm(): void {
        this.llm++;
    }

    recordTool(): void {
        this.tools++;
    }

    get spentLlm(): number {
        return this.llm;
    }

    get spentTools(): number {
        return this.tools;
    }
}
