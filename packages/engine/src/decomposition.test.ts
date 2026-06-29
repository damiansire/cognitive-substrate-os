import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { normalizeTasks, decomposeGoal, MAX_SUBTASKS } from './decomposition';

let savedKey: string | undefined;
beforeEach(() => {
    savedKey = process.env['GEMINI_API_KEY'];
    delete process.env['GEMINI_API_KEY']; // force simulation mode
});
afterEach(() => {
    if (savedKey !== undefined) process.env['GEMINI_API_KEY'] = savedKey;
});

describe('normalizeTasks', () => {
    it('trims, strips checkbox/bullet prefixes and drops empties', () => {
        const out = normalizeTasks(['- [ ] Hacer A', '  * Hacer B  ', '', '   ']);
        expect(out).toEqual(['Hacer A', 'Hacer B']);
    });

    it('dedupes case-insensitively', () => {
        expect(normalizeTasks(['Tarea', 'tarea', 'TAREA'])).toEqual(['Tarea']);
    });

    it('caps the number of subtasks', () => {
        const many = Array.from({ length: 50 }, (_, i) => `Tarea ${i}`);
        expect(normalizeTasks(many)).toHaveLength(MAX_SUBTASKS);
    });

    it('returns [] for non-arrays', () => {
        expect(normalizeTasks('nope' as unknown)).toEqual([]);
    });
});

describe('decomposeGoal (simulation mode)', () => {
    it('falls back to the goal as a single task without an API key', async () => {
        expect(await decomposeGoal('Construir un TODO app')).toEqual(['Construir un TODO app']);
    });

    it('returns [] for an empty goal', async () => {
        expect(await decomposeGoal('   ')).toEqual([]);
    });
});
