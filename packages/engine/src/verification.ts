import * as fs from 'fs';
import * as path from 'path';
import { generateJson, hasApiKey } from '@cognitive-substrate/gemini-agent-loop';
import type { Verdict, VerificationCheck } from './types';

/** Extracts file-like tokens (e.g. `app.js`, `src/index.ts`) referenced in a task. */
export function referencedFiles(task: string): string[] {
    const matches = task.match(/[\w./-]+\.[a-zA-Z0-9]{1,6}/g) ?? [];
    // Keep only plausible relative paths, dedupe.
    return Array.from(new Set(matches.filter((m) => !m.startsWith('.') || m.includes('/'))));
}

/**
 * Deterministic, offline checks. These run regardless of whether a model is
 * available and form the verifiable backbone of the verdict.
 */
export function deterministicChecks(
    workspacePath: string,
    task: string,
    log: string,
    executionSuccess: boolean
): VerificationCheck[] {
    const checks: VerificationCheck[] = [];

    checks.push({
        name: 'ejecucion-exitosa',
        passed: executionSuccess,
        detail: executionSuccess ? 'El agente reportó éxito.' : 'El agente reportó fallo.'
    });

    checks.push({
        name: 'log-no-vacio',
        passed: log.trim().length > 0,
        detail: log.trim().length > 0 ? `Log de ${log.trim().length} chars.` : 'El log está vacío.'
    });

    for (const rel of referencedFiles(task)) {
        const exists = fileExistsInside(workspacePath, rel);
        checks.push({
            name: `archivo-existe:${rel}`,
            passed: exists,
            detail: exists ? `${rel} existe en el workspace.` : `${rel} no se encontró en el workspace.`
        });
    }

    return checks;
}

function fileExistsInside(workspacePath: string, relativePath: string): boolean {
    const target = path.resolve(workspacePath, relativePath);
    const rel = path.relative(path.resolve(workspacePath), target);
    if (rel.startsWith('..') || path.isAbsolute(rel)) return false;
    return fs.existsSync(target);
}

const SYSTEM_PROMPT = `Eres un verificador escéptico del Cognitive Substrate OS. Dada una tarea y el log de ejecución de un agente, decides si la tarea fue REALMENTE completada basándote en la evidencia del log. Por defecto, si la evidencia es insuficiente o ambigua, NO está verificada. Respondes SOLO con JSON.`;

/**
 * Verifies whether a task was actually accomplished, producing an auditable verdict.
 *
 * Always runs deterministic checks. When a model is available it ALSO asks a skeptical
 * verifier (defaulting to "not verified" on ambiguity) and requires both the
 * deterministic checks and the model to agree before declaring success.
 *
 * In simulation mode the verdict is purely deterministic: verified iff all
 * deterministic checks pass.
 */
export async function verifyTask(
    workspacePath: string,
    task: string,
    log: string,
    executionSuccess: boolean
): Promise<Verdict> {
    const checks = deterministicChecks(workspacePath, task, log, executionSuccess);
    const deterministicOk = checks.every((c) => c.passed);

    if (!hasApiKey()) {
        return {
            verified: deterministicOk,
            reason: deterministicOk
                ? 'Verificación determinista: todos los checks pasaron (modo simulación).'
                : 'Verificación determinista: al menos un check falló (modo simulación).',
            checks
        };
    }

    const userPrompt = `Tarea:\n${task}\n\nLog de ejecución:\n${log.slice(0, 6000)}\n\nDevuelve JSON {"verified": boolean, "reason": "..."}.`;
    const modelVerdict = await generateJson<{ verified?: boolean; reason?: string }>(SYSTEM_PROMPT, userPrompt);

    const modelOk = modelVerdict?.verified === true;
    checks.push({
        name: 'verificador-llm',
        passed: modelOk,
        detail: modelVerdict?.reason?.trim() || 'El verificador LLM no devolvió un veredicto claro.'
    });

    const verified = deterministicOk && modelOk;
    return {
        verified,
        reason: verified
            ? 'Checks deterministas y verificador LLM coinciden en que la tarea fue completada.'
            : 'La verificación falló: los checks deterministas y/o el verificador LLM no confirman la tarea.',
        checks
    };
}
