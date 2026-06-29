import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { slugify, evidenceStamp, recordRun } from './evidence';
import type { Verdict } from './types';

let workspace: string;
beforeEach(() => {
    workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'csos-evi-'));
});
afterEach(() => {
    fs.rmSync(workspace, { recursive: true, force: true });
});

describe('slugify', () => {
    it('produces a filesystem-safe slug', () => {
        expect(slugify('- [ ] Crear público/índice.html!')).toMatch(/^[a-z0-9-]+$/);
    });
    it('falls back to "task" for empty input', () => {
        expect(slugify('!!!')).toBe('task');
    });
});

describe('evidenceStamp', () => {
    it('removes colons and dots so it is path-safe', () => {
        const stamp = evidenceStamp(new Date('2026-06-29T22:15:16.123Z'));
        expect(stamp).not.toContain(':');
        expect(stamp).not.toContain('.');
    });
});

describe('recordRun', () => {
    it('writes run.json and summary.md and returns a workspace-relative path', () => {
        const verdict: Verdict = {
            verified: true,
            reason: 'todo ok',
            checks: [{ name: 'c1', passed: true, detail: 'd' }]
        };
        const record = recordRun({
            workspacePath: workspace,
            task: '- [ ] Hacer algo',
            startedAt: new Date('2026-06-29T22:00:00Z'),
            finishedAt: new Date('2026-06-29T22:00:05Z'),
            executionSuccess: true,
            verdict,
            log: 'hice algo',
            learning: 'aprendí algo'
        });

        expect(record.evidencePath.startsWith('runs')).toBe(true);
        const absDir = path.resolve(workspace, record.evidencePath);
        expect(fs.existsSync(path.join(absDir, 'run.json'))).toBe(true);
        expect(fs.existsSync(path.join(absDir, 'summary.md'))).toBe(true);

        const parsed = JSON.parse(fs.readFileSync(path.join(absDir, 'run.json'), 'utf8'));
        expect(parsed.verdict.verified).toBe(true);
        expect(parsed.learning).toBe('aprendí algo');
    });
});
