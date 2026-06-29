import * as fs from 'fs';
import * as path from 'path';

export type Severity = 'warning' | 'error';

export interface Incident {
    severity: Severity;
    task: string;
    reason: string;
    evidencePath?: string;
}

const INCIDENTS_FILE = 'incidents.jsonl';

/**
 * Records a structured incident (append-only JSON-lines) when something goes wrong.
 * Complements the human-readable `FAILURE.md` with a machine-queryable trail for
 * observability. Best-effort: never throws.
 */
export function recordIncident(workspacePath: string, incident: Incident, when: Date = new Date()): void {
    try {
        const line = JSON.stringify({ ts: when.toISOString(), ...incident }) + '\n';
        fs.appendFileSync(path.resolve(workspacePath, INCIDENTS_FILE), line, 'utf8');
    } catch {
        // Observability must never break the run.
    }
}

/** Counts recorded incidents in a workspace (0 if none). */
export function countIncidents(workspacePath: string): number {
    const file = path.resolve(workspacePath, INCIDENTS_FILE);
    if (!fs.existsSync(file)) return 0;
    return fs
        .readFileSync(file, 'utf8')
        .split('\n')
        .filter((l) => l.trim().length > 0).length;
}
