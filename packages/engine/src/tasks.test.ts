import { describe, it, expect } from 'vitest';
import {
    parseTasks,
    markTaskDone,
    markTaskFailed,
    addImproveTask,
    appendTasksToNow,
    buildTasksScaffold
} from './tasks';

const SAMPLE = `# Plan de Tareas

## [now]
- [ ] Tarea activa A
- [x] Tarea ya completada
- [!] Tarea fallida

## [next]
- [ ] Tarea futura B

## [improve] - Auto-Mejora y Correcciones

## [recurring]
- [ ] Rutina E
`;

describe('parseTasks', () => {
    it('routes only pending items into queues', () => {
        const q = parseTasks(SAMPLE);
        expect(q.now).toHaveLength(1);
        expect(q.now[0]).toContain('Tarea activa A');
        expect(q.next[0]).toContain('Tarea futura B');
        expect(q.recurring[0]).toContain('Rutina E');
    });

    it('ignores [x] and [!] items', () => {
        const all = Object.values(parseTasks(SAMPLE)).flat().join('\n');
        expect(all).not.toContain('completada');
        expect(all).not.toContain('fallida');
    });
});

describe('task mutations', () => {
    it('marks a task done', () => {
        const out = markTaskDone(SAMPLE, '- [ ] Tarea activa A');
        expect(out).toContain('- [x] Tarea activa A');
    });

    it('marks a task failed', () => {
        const out = markTaskFailed(SAMPLE, '- [ ] Tarea activa A');
        expect(out).toContain('- [!] Tarea activa A');
    });

    it('adds an improve task under the existing improve header', () => {
        const out = addImproveTask(SAMPLE, 'Revisar X');
        expect(out).toContain('## [improve]');
        expect(out).toContain('- [ ] Revisar X');
    });

    it('creates the improve section when missing', () => {
        const out = addImproveTask('# Plan\n\n## [now]\n', 'Revisar Y');
        expect(out).toContain('## [improve]');
        expect(out).toContain('- [ ] Revisar Y');
    });

    it('appends decomposed subtasks under [now]', () => {
        const out = appendTasksToNow('# Plan\n\n## [now]\n', ['Sub 1', 'Sub 2']);
        const now = parseTasks(out).now;
        expect(now).toHaveLength(2);
        expect(now[0]).toContain('Sub 1');
    });
});

describe('buildTasksScaffold', () => {
    it('produces a parseable scaffold with the seed task in [now]', () => {
        const q = parseTasks(buildTasksScaffold('Hacer algo'));
        expect(q.now[0]).toContain('Hacer algo');
    });
});
