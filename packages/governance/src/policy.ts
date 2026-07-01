import * as fs from 'fs';
import * as path from 'path';

/**
 * What to do with a command classified as dangerous when there is no human to approve
 * (the OS runs autonomously): `deny` (safe default) or `allow` (explicit opt-in).
 */
export type GovernanceMode = 'deny' | 'allow';

/** Where shell commands run: the host shell (`native`) or an isolated container. */
export type TerminalMode = 'native' | 'container';

/**
 * How task claiming is coordinated:
 *  - `local`: filesystem locks (single machine / shared volume). Default.
 *  - `http`: a shared coordination server, so workers on DIFFERENT machines coordinate.
 */
export interface CoordinationConfig {
    mode: 'local' | 'http';
    /** Base URL of the coordination server when mode is 'http'. */
    endpoint?: string;
}

export interface Policy {
    /** Default disposition for dangerous commands without human approval. */
    mode: GovernanceMode;
    /** Execution surface for shell commands. */
    terminal: TerminalMode;
    /** Substrings that are always allowed (override dangerous classification). */
    allow: string[];
    /** Substrings that are always denied (override everything). */
    deny: string[];
    /** Hard cap on model round-trips per task (bounded autonomy). */
    maxLlmCallsPerTask: number;
    /** Hard cap on tool invocations per task. */
    maxToolCallsPerTask: number;
    /** Domains the browser may fetch (egress allowlist). Empty = deny all (fail-safe). */
    browserAllowDomains: string[];
    /** Multi-machine coordination backend selection. */
    coordination: CoordinationConfig;
}

export const defaultPolicy: Policy = {
    mode: 'deny',
    terminal: 'native',
    allow: [],
    deny: [],
    maxLlmCallsPerTask: 30,
    maxToolCallsPerTask: 50,
    browserAllowDomains: [],
    coordination: { mode: 'local' }
};

const POLICY_FILE = 'governance.json';

/**
 * Loads `<rootDir>/governance.json` if present and merges it over the safe defaults.
 * Missing or malformed files fall back to `defaultPolicy` (fail-safe, not fail-open).
 */
export function loadPolicy(rootDir: string): Policy {
    const file = path.resolve(rootDir, POLICY_FILE);
    if (!fs.existsSync(file)) return { ...defaultPolicy };
    try {
        const raw = JSON.parse(fs.readFileSync(file, 'utf8')) as Partial<Policy>;
        return {
            mode: raw.mode === 'allow' ? 'allow' : 'deny',
            terminal: raw.terminal === 'container' ? 'container' : 'native',
            allow: Array.isArray(raw.allow) ? raw.allow.map(String) : [],
            deny: Array.isArray(raw.deny) ? raw.deny.map(String) : [],
            maxLlmCallsPerTask:
                typeof raw.maxLlmCallsPerTask === 'number' ? raw.maxLlmCallsPerTask : defaultPolicy.maxLlmCallsPerTask,
            maxToolCallsPerTask:
                typeof raw.maxToolCallsPerTask === 'number'
                    ? raw.maxToolCallsPerTask
                    : defaultPolicy.maxToolCallsPerTask,
            browserAllowDomains: Array.isArray(raw.browserAllowDomains) ? raw.browserAllowDomains.map(String) : [],
            coordination:
                raw.coordination && raw.coordination.mode === 'http'
                    ? { mode: 'http', endpoint: String(raw.coordination.endpoint ?? '') }
                    : { mode: 'local' }
        };
    } catch {
        return { ...defaultPolicy };
    }
}
