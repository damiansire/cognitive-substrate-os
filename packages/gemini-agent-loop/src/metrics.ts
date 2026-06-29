/**
 * Process-wide counter of model calls. Used by the eval harness to report an honest
 * cost-to-pass (number of LLM round-trips). In simulation mode this stays at 0.
 */
let llmCalls = 0;

export function recordLlmCall(): void {
    llmCalls++;
}

export function getLlmCalls(): number {
    return llmCalls;
}

export function resetLlmCalls(): void {
    llmCalls = 0;
}
