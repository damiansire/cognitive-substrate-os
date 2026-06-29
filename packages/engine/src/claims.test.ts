import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { claimTask, releaseClaim, isClaimed, claimFileName } from './claims';

let ws: string;
beforeEach(() => {
    ws = fs.mkdtempSync(path.join(os.tmpdir(), 'csos-claim-'));
});
afterEach(() => {
    fs.rmSync(ws, { recursive: true, force: true });
});

const TASK = '- [ ] Hacer algo importante';

describe('claimFileName', () => {
    it('produces a safe filename', () => {
        expect(claimFileName(TASK)).toMatch(/^[a-z0-9-]+\.json$/);
    });
});

describe('pull-based claiming', () => {
    it('lets only one worker hold a claim at a time', () => {
        expect(claimTask(ws, TASK, 'worker-A')).toBe(true);
        expect(claimTask(ws, TASK, 'worker-B')).toBe(false);
        expect(isClaimed(ws, TASK)).toBe(true);
    });

    it('is re-entrant for the same worker', () => {
        expect(claimTask(ws, TASK, 'worker-A')).toBe(true);
        expect(claimTask(ws, TASK, 'worker-A')).toBe(true);
    });

    it('frees the task on release so another worker can claim it', () => {
        expect(claimTask(ws, TASK, 'worker-A')).toBe(true);
        releaseClaim(ws, TASK, 'worker-A');
        expect(isClaimed(ws, TASK)).toBe(false);
        expect(claimTask(ws, TASK, 'worker-B')).toBe(true);
    });

    it('does not let a worker release a claim it does not hold', () => {
        expect(claimTask(ws, TASK, 'worker-A')).toBe(true);
        releaseClaim(ws, TASK, 'worker-B'); // not the holder -> no-op
        expect(isClaimed(ws, TASK)).toBe(true);
    });

    it('lets another worker take over an EXPIRED claim', () => {
        const t0 = new Date('2026-06-30T00:00:00Z');
        expect(claimTask(ws, TASK, 'worker-A', 1000, t0)).toBe(true);
        const later = new Date('2026-06-30T00:01:00Z'); // past 1s TTL
        expect(isClaimed(ws, TASK, later)).toBe(false);
        expect(claimTask(ws, TASK, 'worker-B', 1000, later)).toBe(true);
    });
});
