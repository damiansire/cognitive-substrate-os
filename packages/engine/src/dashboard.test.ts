import { describe, it, expect } from 'vitest';
import { renderDashboard } from './dashboard';
import type { WorkspaceResult } from './types';

const results: WorkspaceResult[] = [
    {
        project: 'alpha',
        pendingNow: 2,
        incidents: 1,
        summary: '[alpha] ✅ Verificado: hacer X',
        run: {
            workspace: '/ws/alpha',
            task: '- [ ] hacer X',
            startedAt: '2026-06-29T22:00:00Z',
            finishedAt: '2026-06-29T22:00:05Z',
            executionSuccess: true,
            verdict: { verified: true, reason: 'ok', checks: [] },
            log: 'log',
            learning: 'aprendí',
            evidencePath: 'runs/2026-x-hacer-x'
        }
    },
    { project: 'beta', pendingNow: 0, incidents: 0, summary: '', run: null }
];

describe('renderDashboard', () => {
    it('summarizes mode, totals and per-workspace rows', () => {
        const md = renderDashboard({ mode: 'global', updatedAt: new Date('2026-06-29T22:00:10Z'), results });
        expect(md).toContain('Daemon Global');
        expect(md).toContain('Tareas [now] pendientes:** 2');
        expect(md).toContain('| alpha |');
        expect(md).toContain('runs/2026-x-hacer-x');
        expect(md).toContain('✅');
    });

    it('handles the empty case', () => {
        const md = renderDashboard({ mode: 'local', updatedAt: new Date('2026-06-29T22:00:10Z'), results: [] });
        expect(md).toContain('sin workspaces');
    });
});
