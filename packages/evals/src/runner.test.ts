import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { runEvals, runCase } from './runner';
import { renderReportMarkdown } from './report';
import { cases } from './cases';
import type { EvalCase } from './types';

let savedKey: string | undefined;
beforeEach(() => {
    savedKey = process.env['GEMINI_API_KEY'];
    delete process.env['GEMINI_API_KEY']; // deterministic simulation run
});
afterEach(() => {
    if (savedKey !== undefined) process.env['GEMINI_API_KEY'] = savedKey;
});

describe('runner', () => {
    it('captures a thrown case as a failed result instead of crashing', async () => {
        const boom: EvalCase = {
            id: 'boom',
            category: 'regression',
            description: 'always throws',
            async run() {
                throw new Error('kaboom');
            }
        };
        const result = await runCase(boom);
        expect(result.passed).toBe(false);
        expect(result.error).toContain('kaboom');
    });

    it('aggregates a report with per-category breakdown', async () => {
        const report = await runEvals(cases.slice(0, 3));
        expect(report.total).toBe(3);
        expect(report.passRate).toBeGreaterThanOrEqual(0);
        expect(Object.keys(report.byCategory).length).toBeGreaterThan(0);
        expect(renderReportMarkdown(report)).toContain('Eval Report');
    });
});

describe('eval suite (simulation)', () => {
    it('passes every case offline', async () => {
        const report = await runEvals(cases);
        const failed = report.results.filter((r) => !r.passed);
        expect(failed, JSON.stringify(failed, null, 2)).toHaveLength(0);
        expect(report.simulation).toBe(true);
        expect(report.totalLlmCalls).toBe(0);
    });
});
