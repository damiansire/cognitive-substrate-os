import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { parseCadence, recurringKey, advanceTick, nextDueRecurring, markRecurringRan } from './recurring';
import { recordIncident, countIncidents } from './incidents';

let ws: string;
beforeEach(() => {
    ws = fs.mkdtempSync(path.join(os.tmpdir(), 'csos-rec-'));
});
afterEach(() => {
    fs.rmSync(ws, { recursive: true, force: true });
});

describe('parseCadence / recurringKey', () => {
    it('parses @every:N and defaults to 1', () => {
        expect(parseCadence('- [ ] @every:3 Backup')).toBe(3);
        expect(parseCadence('- [ ] Backup')).toBe(1);
    });
    it('builds a stable key without checkbox/cadence', () => {
        expect(recurringKey('- [ ] @every:3 Hacer Backup')).toBe('hacer backup');
    });
});

describe('recurring scheduling', () => {
    it('runs a cadence-3 task only when due', () => {
        const tasks = ['- [ ] @every:3 Backup'];

        const t1 = advanceTick(ws); // 1
        const due1 = nextDueRecurring(ws, tasks, t1);
        expect(due1).not.toBeNull(); // never run -> due
        markRecurringRan(ws, tasks[0]!, t1);

        const t2 = advanceTick(ws); // 2
        expect(nextDueRecurring(ws, tasks, t2)).toBeNull(); // 2-1 < 3

        const t3 = advanceTick(ws); // 3
        expect(nextDueRecurring(ws, tasks, t3)).toBeNull(); // 3-1 < 3

        const t4 = advanceTick(ws); // 4
        expect(nextDueRecurring(ws, tasks, t4)).not.toBeNull(); // 4-1 >= 3
    });
});

describe('incidents', () => {
    it('records and counts incidents', () => {
        expect(countIncidents(ws)).toBe(0);
        recordIncident(ws, { severity: 'error', task: 'X', reason: 'falló' });
        recordIncident(ws, { severity: 'warning', task: 'Y', reason: 'flaky' });
        expect(countIncidents(ws)).toBe(2);
    });
});
