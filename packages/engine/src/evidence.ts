import * as fs from 'fs';
import * as path from 'path';
import type { RunRecord, Verdict } from './types';

/** Turns an arbitrary task string into a short, filesystem-safe slug. */
export function slugify(text: string, maxLen = 40): string {
    const slug = text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, maxLen)
        .replace(/-+$/g, '');
    return slug || 'task';
}

/** A timestamp safe for use in a directory name (no colons). */
export function evidenceStamp(date: Date): string {
    return date.toISOString().replace(/[:.]/g, '-');
}

interface RecordRunInput {
    workspacePath: string;
    task: string;
    startedAt: Date;
    finishedAt: Date;
    executionSuccess: boolean;
    verdict: Verdict;
    log: string;
    learning: string;
}

/**
 * Persists a complete, auditable record of one run to
 * `<workspace>/runs/<timestamp>-<slug>/` containing machine-readable `run.json`
 * and a human-readable `summary.md`. Returns the full RunRecord (with the
 * workspace-relative evidence path).
 *
 * Nothing in the OS may declare a task complete without an evidence record — this
 * is the function that makes that guarantee concrete.
 */
export function recordRun(input: RecordRunInput): RunRecord {
    const { workspacePath, task, startedAt, finishedAt, executionSuccess, verdict, log, learning } = input;
    const dirName = `${evidenceStamp(startedAt)}-${slugify(task)}`;
    const evidencePath = path.join('runs', dirName);
    const absDir = path.resolve(workspacePath, evidencePath);
    fs.mkdirSync(absDir, { recursive: true });

    const record: RunRecord = {
        workspace: workspacePath,
        task,
        startedAt: startedAt.toISOString(),
        finishedAt: finishedAt.toISOString(),
        executionSuccess,
        verdict,
        log,
        learning,
        evidencePath
    };

    fs.writeFileSync(path.join(absDir, 'run.json'), JSON.stringify(record, null, 2), 'utf8');
    fs.writeFileSync(path.join(absDir, 'summary.md'), renderSummary(record), 'utf8');
    return record;
}

function renderSummary(r: RunRecord): string {
    const status = r.verdict.verified ? '✅ VERIFICADO' : '❌ NO VERIFICADO';
    const checks = r.verdict.checks.map((c) => `  - ${c.passed ? '✓' : '✗'} **${c.name}**: ${c.detail}`).join('\n');
    return [
        `# Run: ${r.task.trim()}`,
        '',
        `- **Estado:** ${status}`,
        `- **Ejecución exitosa:** ${r.executionSuccess ? 'sí' : 'no'}`,
        `- **Inicio:** ${r.startedAt}`,
        `- **Fin:** ${r.finishedAt}`,
        '',
        `## Veredicto`,
        r.verdict.reason,
        '',
        `### Checks`,
        checks || '  (sin checks)',
        '',
        `## Aprendizaje`,
        r.learning || '(ninguno)',
        '',
        `## Log de ejecución`,
        '```',
        r.log.trim() || '(vacío)',
        '```',
        ''
    ].join('\n');
}
