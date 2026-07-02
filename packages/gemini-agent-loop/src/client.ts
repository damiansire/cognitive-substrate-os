import { GoogleGenAI } from '@google/genai';
import { recordLlmCall } from './metrics';

export const DEFAULT_MODEL = 'gemini-2.5-flash';
const MAX_BACKOFF_ATTEMPTS = 3;
/** Cap on how long we'll honor a server-provided `Retry-After` before giving up on it. */
const MAX_RETRY_AFTER_MS = 60_000;

/** HTTP statuses we treat as transient and safe to retry. Everything else — 4xx input
 * errors, auth failures, and especially aborts — is surfaced immediately: retrying them
 * just burns budget and latency for the same failure. */
const RETRYABLE_STATUSES = new Set([429, 503]);

/** Whether an error from the Gemini SDK is a transient one worth retrying. Aborts are
 * never retryable; a status must be explicitly on the allowlist. */
export function isRetryableError(err: unknown): boolean {
    const e = err as { status?: number; name?: string; code?: string } | null | undefined;
    if (e?.name === 'AbortError' || e?.code === 'ABORT_ERR') return false;
    return typeof e?.status === 'number' && RETRYABLE_STATUSES.has(e.status);
}

/**
 * Milliseconds to wait per a server `Retry-After` header, or null if absent/unparseable.
 * Supports both forms: delta-seconds (`Retry-After: 30`) and an HTTP-date. Looks in the
 * common SDK error shapes (`err.headers` as a plain object or a `Headers`-like getter).
 * Clamped to `[0, MAX_RETRY_AFTER_MS]`.
 */
export function retryAfterMs(err: unknown, nowMs: number = Date.now()): number | null {
    const headers = (err as { headers?: unknown })?.headers;
    let raw: string | null = null;
    if (headers && typeof (headers as { get?: unknown }).get === 'function') {
        raw = (headers as { get(name: string): string | null }).get('retry-after');
    } else if (headers && typeof headers === 'object') {
        const rec = headers as Record<string, unknown>;
        const v = rec['retry-after'] ?? rec['Retry-After'];
        raw = typeof v === 'string' ? v : typeof v === 'number' ? String(v) : null;
    }
    if (!raw) return null;

    const asSeconds = Number(raw);
    let ms: number;
    if (Number.isFinite(asSeconds)) {
        ms = asSeconds * 1000;
    } else {
        const dateMs = Date.parse(raw);
        if (!Number.isFinite(dateMs)) return null;
        ms = dateMs - nowMs;
    }
    return Math.max(0, Math.min(ms, MAX_RETRY_AFTER_MS));
}

/** Exponential backoff with full jitter (avoids synchronized retry storms across workers).
 * A server `Retry-After` wins as a floor when present. */
function backoffDelayMs(attempt: number, retryAfter: number | null): number {
    const exp = Math.pow(2, attempt) * 1000;
    const jittered = Math.random() * exp;
    return Math.max(retryAfter ?? 0, jittered);
}

/**
 * True when a usable Gemini API key is configured. When false the system runs in
 * "simulation mode": LLM-backed steps degrade to deterministic fallbacks so the OS
 * (and its offline evals/tests) keep working without network or credentials.
 */
export function hasApiKey(): boolean {
    const key = process.env['GEMINI_API_KEY'];
    return !!key && !key.includes('tu_clave_aqui');
}

function getClient(): GoogleGenAI {
    return new GoogleGenAI({ apiKey: process.env['GEMINI_API_KEY'] });
}

/** Injectable delay, so tests can drive `withBackoff` with fake timers instead of real waits. */
export interface BackoffDeps {
    sleep?: (ms: number) => Promise<void>;
    maxAttempts?: number;
}

const realSleep = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));

export async function withBackoff<T>(fn: () => Promise<T>, deps: BackoffDeps = {}): Promise<T> {
    const sleep = deps.sleep ?? realSleep;
    const maxAttempts = deps.maxAttempts ?? MAX_BACKOFF_ATTEMPTS;
    let attempts = 0;
    while (true) {
        try {
            return await fn();
        } catch (apiError) {
            attempts++;
            // Only retry explicitly-transient errors, and never past the attempt cap.
            if (!isRetryableError(apiError) || attempts >= maxAttempts) throw apiError;
            const waitTime = backoffDelayMs(attempts, retryAfterMs(apiError));
            const status = (apiError as { status?: number })?.status;
            console.warn(`>>> [LLM] ${status} detectado. Reintentando en ${Math.round(waitTime)}ms...`);
            await sleep(waitTime);
        }
    }
}

/**
 * One-shot structured generation. Asks the model to return JSON and parses it.
 * Returns `null` when no API key is configured (simulation mode) so callers can
 * fall back to deterministic behavior.
 *
 * @param systemPrompt - High-level instruction / role.
 * @param userPrompt - The concrete request.
 * @param model - Model id (defaults to gemini-2.5-flash).
 */
export async function generateJson<T = unknown>(
    systemPrompt: string,
    userPrompt: string,
    model: string = DEFAULT_MODEL
): Promise<T | null> {
    if (!hasApiKey()) return null;

    const ai = getClient();
    const response = await withBackoff(() => {
        recordLlmCall();
        return ai.models.generateContent({
            model,
            contents: userPrompt,
            config: {
                systemInstruction: systemPrompt,
                temperature: 0.2,
                responseMimeType: 'application/json'
            }
        });
    });

    const text = response.text?.trim();
    if (!text) return null;
    try {
        return JSON.parse(text) as T;
    } catch {
        // Strip markdown code fences if the model wrapped the JSON.
        const cleaned = text
            .replace(/^```(?:json)?/i, '')
            .replace(/```$/, '')
            .trim();
        try {
            return JSON.parse(cleaned) as T;
        } catch {
            return null;
        }
    }
}
