import * as fs from 'fs';
import * as path from 'path';

const STATE_FILE = path.join('runs', '.recurring-state.json');

interface RecurringState {
    /** Monotonic tick counter for this workspace. */
    tick: number;
    /** taskKey -> last tick the task ran. */
    lastRun: Record<string, number>;
}

/** Parses the cadence from a recurring task line: `@every:N` (ticks). Defaults to 1. */
export function parseCadence(taskLine: string): number {
    const m = taskLine.match(/@every:(\d+)/i);
    if (!m) return 1;
    const n = parseInt(m[1]!, 10);
    return n >= 1 ? n : 1;
}

/** Stable key for a recurring task (strip checkbox + cadence annotation). */
export function recurringKey(taskLine: string): string {
    return taskLine
        .replace(/^-\s*\[[ x!]\]\s*/, '')
        .replace(/@every:\d+/i, '')
        .trim()
        .toLowerCase();
}

function readState(workspacePath: string): RecurringState {
    const file = path.resolve(workspacePath, STATE_FILE);
    if (!fs.existsSync(file)) return { tick: 0, lastRun: {} };
    try {
        const parsed = JSON.parse(fs.readFileSync(file, 'utf8'));
        return {
            tick: typeof parsed.tick === 'number' ? parsed.tick : 0,
            lastRun: parsed.lastRun && typeof parsed.lastRun === 'object' ? parsed.lastRun : {}
        };
    } catch {
        return { tick: 0, lastRun: {} };
    }
}

function writeState(workspacePath: string, state: RecurringState): void {
    const file = path.resolve(workspacePath, STATE_FILE);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, JSON.stringify(state, null, 2), 'utf8');
}

/** Advances the workspace's recurring tick counter and returns the new tick. */
export function advanceTick(workspacePath: string): number {
    const state = readState(workspacePath);
    state.tick += 1;
    writeState(workspacePath, state);
    return state.tick;
}

/**
 * Picks the next DUE recurring task given the current tick, or null. A task is due when
 * `tick - lastRun >= cadence`. Recurring tasks are never consumed (they stay `- [ ]`);
 * instead we record when each last ran.
 */
export function nextDueRecurring(workspacePath: string, recurringTasks: string[], tick: number): string | null {
    if (recurringTasks.length === 0) return null;
    const state = readState(workspacePath);
    for (const task of recurringTasks) {
        const key = recurringKey(task);
        const last = state.lastRun[key] ?? -Infinity;
        if (tick - last >= parseCadence(task)) {
            return task;
        }
    }
    return null;
}

/** Marks a recurring task as having run at the given tick. */
export function markRecurringRan(workspacePath: string, taskLine: string, tick: number): void {
    const state = readState(workspacePath);
    state.lastRun[recurringKey(taskLine)] = tick;
    writeState(workspacePath, state);
}
