import { generateJson, hasApiKey } from '@cognitive-substrate/gemini-agent-loop';

/** Upper bound on how many subtasks one goal decomposes into, to keep queues sane. */
export const MAX_SUBTASKS = 12;

/**
 * Cleans a raw list of candidate subtasks: trims, drops empties, removes any
 * checkbox/markdown prefix the model may have added, dedupes, and caps the count.
 * Pure and deterministic — the unit-tested core of decomposition.
 */
export function normalizeTasks(raw: unknown): string[] {
    if (!Array.isArray(raw)) return [];
    const seen = new Set<string>();
    const out: string[] = [];
    for (const item of raw) {
        if (typeof item !== 'string') continue;
        const clean = item.replace(/^\s*(?:[-*]\s*)?(?:\[[ x!]\]\s*)?/, '').trim();
        if (!clean) continue;
        const key = clean.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        out.push(clean);
        if (out.length >= MAX_SUBTASKS) break;
    }
    return out;
}

const SYSTEM_PROMPT = `Eres un planificador del Cognitive Substrate OS. Descompones un objetivo de alto nivel en una lista ordenada de subtareas concretas, accionables y verificables, lo bastante pequeñas para que un agente las complete una por una. Respondes SOLO con JSON.`;

/**
 * Decomposes a high-level goal into an ordered list of concrete subtasks.
 *
 * In simulation mode (no API key) it degrades to treating the goal itself as a
 * single task, so the rest of the loop still runs offline.
 *
 * @param goal - The high-level goal text (from the workspace `goal.md`).
 * @returns An ordered list of subtask descriptions (never empty if `goal` is non-empty).
 */
export async function decomposeGoal(goal: string): Promise<string[]> {
    const trimmed = goal.trim();
    if (!trimmed) return [];
    if (!hasApiKey()) return [trimmed];

    const userPrompt = `Objetivo:\n${trimmed}\n\nDevuelve un JSON con la forma {"tasks": ["subtarea 1", "subtarea 2", ...]} en orden de ejecución.`;
    const result = await generateJson<{ tasks?: unknown }>(SYSTEM_PROMPT, userPrompt);
    const tasks = normalizeTasks(result?.tasks);
    return tasks.length > 0 ? tasks : [trimmed];
}
