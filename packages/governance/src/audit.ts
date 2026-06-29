import * as fs from 'fs';
import * as path from 'path';

export interface AuditEntry {
    tool: string;
    allowed: boolean;
    reason?: string;
    command?: string;
    detail?: string;
}

const AUDIT_FILE = 'audit.log';

/**
 * Appends a tool invocation + governance decision to the workspace's append-only
 * audit trail (`audit.log`, JSON-lines). Every action the OS takes is auditable —
 * a CHARTER requirement ("a system that cannot be paused, audited, or rolled back"
 * is an anti-pattern). Best-effort: auditing must never crash the agent.
 */
export function appendAudit(workspacePath: string, entry: AuditEntry, when: Date = new Date()): void {
    try {
        const line = JSON.stringify({ ts: when.toISOString(), ...entry }) + '\n';
        fs.appendFileSync(path.resolve(workspacePath, AUDIT_FILE), line, 'utf8');
    } catch {
        // Auditing is best-effort; never let it break execution.
    }
}
