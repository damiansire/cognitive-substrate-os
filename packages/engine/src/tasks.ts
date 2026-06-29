/** The five momentum queues the OS tracks in each workspace's `tasks.md`. */
export type QueueName = 'now' | 'next' | 'blocked' | 'improve' | 'recurring';

export type TaskQueues = Record<QueueName, string[]>;

const SECTION_MARKERS: Array<[string, QueueName]> = [
    ['## [now]', 'now'],
    ['## [next]', 'next'],
    ['## [blocked]', 'blocked'],
    ['## [improve]', 'improve'],
    ['## [recurring]', 'recurring']
];

/**
 * Parses a `tasks.md` file into its five queues. Only unchecked items (`- [ ]`)
 * are collected; checked (`- [x]`) and failed (`- [!]`) items are intentionally
 * ignored so the engine only ever picks up pending work.
 */
export function parseTasks(content: string): TaskQueues {
    const lines = content.split('\n');
    let currentSection: QueueName | '' = '';
    const queues: TaskQueues = { now: [], next: [], blocked: [], improve: [], recurring: [] };

    for (const line of lines) {
        const marker = SECTION_MARKERS.find(([m]) => line.includes(m));
        if (marker) {
            currentSection = marker[1];
        } else if (line.startsWith('- [ ]') && currentSection) {
            queues[currentSection].push(line);
        }
    }
    return queues;
}

/** Marks a specific task line as completed (`- [ ]` → `- [x]`). */
export function markTaskDone(content: string, taskLine: string): string {
    return content.replace(taskLine, taskLine.replace('- [ ]', '- [x]'));
}

/** Marks a specific task line as failed (`- [ ]` → `- [!]`). */
export function markTaskFailed(content: string, taskLine: string): string {
    return content.replace(taskLine, taskLine.replace('- [ ]', '- [!]'));
}

const IMPROVE_HEADER = '## [improve]';

/**
 * Queues a follow-up item under the `[improve]` section, creating the section if
 * it doesn't exist. This is what feeds the self-improvement loop (later milestone).
 */
export function addImproveTask(content: string, text: string): string {
    const item = `- [ ] ${text.trim()}`;
    const headerLine = content.split('\n').find((l) => l.includes(IMPROVE_HEADER));
    if (headerLine) {
        return content.replace(headerLine, `${headerLine}\n${item}`);
    }
    const trimmed = content.endsWith('\n') ? content : `${content}\n`;
    return `${trimmed}\n${IMPROVE_HEADER} - Auto-Mejora y Correcciones\n${item}\n`;
}

/** Builds a fresh `tasks.md` scaffold with the five queues and one seed task. */
export function buildTasksScaffold(seedTask: string): string {
    return [
        '# Plan de Tareas',
        '',
        '## [now]',
        `- [ ] ${seedTask.trim()}`,
        '',
        '## [next]',
        '',
        '## [blocked]',
        '',
        '## [improve] - Auto-Mejora y Correcciones',
        '',
        '## [recurring]',
        ''
    ].join('\n');
}

/** Appends decomposed subtasks under the `[now]` queue of an existing tasks.md. */
export function appendTasksToNow(content: string, tasks: string[]): string {
    if (tasks.length === 0) return content;
    const items = tasks.map((t) => `- [ ] ${t.trim()}`).join('\n');
    const nowHeader = content.split('\n').find((l) => l.includes('## [now]'));
    if (nowHeader) {
        return content.replace(nowHeader, `${nowHeader}\n${items}`);
    }
    const trimmed = content.endsWith('\n') ? content : `${content}\n`;
    return `${trimmed}\n## [now]\n${items}\n`;
}
