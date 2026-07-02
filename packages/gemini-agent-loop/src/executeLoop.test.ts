import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { executeTaskWithLLM, type AgentResponse, type ChatLike, type ExecuteDeps } from './index';
import { resetLlmCalls } from './metrics';

let ws: string;
beforeEach(() => {
    ws = fs.mkdtempSync(path.join(os.tmpdir(), 'csos-loop-'));
    resetLlmCalls();
});
afterEach(() => fs.rmSync(ws, { recursive: true, force: true }));

function writeGovernance(cfg: Record<string, unknown>): void {
    fs.writeFileSync(path.join(ws, 'governance.json'), JSON.stringify(cfg));
}

/** A chat whose `sendMessage` returns a scripted sequence, recording every message it
 * received so we can assert what the loop fed back. `throwOnCall` injects an error for a
 * given physical call index (to exercise backoff). */
function scriptedChat(
    script: AgentResponse[],
    throwOnCall?: { index: number; error: unknown }
): { chat: ChatLike; received: unknown[] } {
    const received: unknown[] = [];
    let physicalCall = 0;
    let scriptStep = 0;
    const chat: ChatLike = {
        async sendMessage(input) {
            const thisCall = physicalCall++;
            if (throwOnCall && thisCall === throwOnCall.index) throw throwOnCall.error;
            received.push(input.message);
            return script[scriptStep++] ?? { text: 'fin' };
        }
    };
    return { chat, received };
}

const noWaitDeps = (chat: ChatLike): ExecuteDeps => ({
    createChat: () => chat,
    sleep: async () => {}
});

describe('executeTaskWithLLM — core loop (via injected chat, no API)', () => {
    it('reinjects tool results as functionResponse parts and completes', async () => {
        const { chat, received } = scriptedChat([
            { functionCalls: [{ id: 'c1', name: 'writeFile', args: { filepath: 'out.txt', content: 'hola' } }] },
            { text: 'listo' }
        ]);

        const res = await executeTaskWithLLM(ws, '- [ ] escribir out.txt', 'core', noWaitDeps(chat));

        expect(res.success).toBe(true);
        // The tool actually ran (real dispatchTool → sandbox-fs).
        expect(fs.readFileSync(path.join(ws, 'out.txt'), 'utf8')).toBe('hola');
        // First message is the task; second is the functionResponse parts (not stringified).
        expect(typeof received[0]).toBe('string');
        const secondMsg = received[1] as Array<{
            functionResponse?: { name?: string; response?: { output?: string } };
        }>;
        expect(Array.isArray(secondMsg)).toBe(true);
        expect(secondMsg[0]?.functionResponse?.name).toBe('writeFile');
        expect(secondMsg[0]?.functionResponse?.response?.output).toContain('Success');
    });

    it('stops when the per-task LLM budget is exhausted', async () => {
        writeGovernance({ maxLlmCallsPerTask: 1 });
        // Always asks for another tool call, so only the budget can stop it.
        const { chat } = scriptedChat([
            { functionCalls: [{ id: 'c1', name: 'listFiles', args: { dirpath: '.' } }] },
            { functionCalls: [{ id: 'c2', name: 'listFiles', args: { dirpath: '.' } }] }
        ]);

        const res = await executeTaskWithLLM(ws, '- [ ] loop', 'core', noWaitDeps(chat));

        expect(res.success).toBe(false);
        expect(res.log).toContain('Budget de LLM agotado');
    });

    it('retries a transient 503 then succeeds (backoff via injected sleep)', async () => {
        const { chat } = scriptedChat([{ text: 'ok' }], {
            index: 0,
            error: Object.assign(new Error('overloaded'), { status: 503 })
        });
        const waits: number[] = [];
        const res = await executeTaskWithLLM(ws, '- [ ] x', 'core', {
            createChat: () => chat,
            sleep: async (ms) => void waits.push(ms)
        });
        expect(res.success).toBe(true);
        expect(waits).toHaveLength(1);
    });

    it('pauses the task when a dangerous command is deferred to a human', async () => {
        writeGovernance({ mode: 'defer' });
        const { chat } = scriptedChat([
            { functionCalls: [{ id: 'c1', name: 'runCommand', args: { command: 'rm -rf build' } }] }
        ]);

        const res = await executeTaskWithLLM(ws, '- [ ] borrar', 'core', noWaitDeps(chat));

        expect(res.success).toBe(false);
        expect(res.awaitingApproval?.command).toBe('rm -rf build');
        expect(res.awaitingApproval?.approvalId).toBeTruthy();
    });
});
