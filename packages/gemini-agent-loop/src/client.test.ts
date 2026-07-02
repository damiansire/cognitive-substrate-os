import { describe, it, expect, vi } from 'vitest';
import { withBackoff, isRetryableError, retryAfterMs } from './client';

/** An error shaped like the Gemini SDK's ApiError. */
function apiError(status: number, headers?: Record<string, string>): Error & { status: number; headers?: unknown } {
    return Object.assign(new Error(`HTTP ${status}`), { status, ...(headers ? { headers } : {}) });
}

describe('isRetryableError', () => {
    it('retries only 429 and 503', () => {
        expect(isRetryableError(apiError(429))).toBe(true);
        expect(isRetryableError(apiError(503))).toBe(true);
        expect(isRetryableError(apiError(500))).toBe(false);
        expect(isRetryableError(apiError(400))).toBe(false);
        expect(isRetryableError(apiError(401))).toBe(false);
    });
    it('never retries aborts or status-less errors', () => {
        expect(isRetryableError(Object.assign(new Error('x'), { name: 'AbortError' }))).toBe(false);
        expect(isRetryableError(new Error('network down'))).toBe(false);
        expect(isRetryableError(null)).toBe(false);
    });
});

describe('retryAfterMs', () => {
    it('parses delta-seconds', () => {
        expect(retryAfterMs(apiError(429, { 'retry-after': '30' }))).toBe(30_000);
    });
    it('parses an HTTP-date relative to now', () => {
        const now = Date.parse('2026-07-05T00:00:00Z');
        expect(retryAfterMs(apiError(503, { 'retry-after': 'Sun, 05 Jul 2026 00:00:10 GMT' }), now)).toBe(10_000);
    });
    it('clamps to the 60s ceiling and floors negatives at 0', () => {
        expect(retryAfterMs(apiError(429, { 'retry-after': '9999' }))).toBe(60_000);
        const now = Date.parse('2026-07-05T00:01:00Z');
        expect(retryAfterMs(apiError(503, { 'retry-after': 'Sun, 05 Jul 2026 00:00:00 GMT' }), now)).toBe(0);
    });
    it('returns null when absent/unparseable', () => {
        expect(retryAfterMs(apiError(429))).toBeNull();
        expect(retryAfterMs(apiError(429, { 'retry-after': 'nonsense' }))).toBeNull();
    });
});

describe('withBackoff', () => {
    // Deterministic sleep spy — no real timers, no real waits.
    const spySleep = () => {
        const waits: number[] = [];
        return { sleep: async (ms: number) => void waits.push(ms), waits };
    };

    it('succeeds without sleeping when fn works first try', async () => {
        const { sleep, waits } = spySleep();
        const fn = vi.fn().mockResolvedValue('ok');
        await expect(withBackoff(fn, { sleep })).resolves.toBe('ok');
        expect(fn).toHaveBeenCalledTimes(1);
        expect(waits).toHaveLength(0);
    });

    it('retries a 503 then succeeds', async () => {
        const { sleep, waits } = spySleep();
        const fn = vi.fn().mockRejectedValueOnce(apiError(503)).mockResolvedValue('ok');
        await expect(withBackoff(fn, { sleep })).resolves.toBe('ok');
        expect(fn).toHaveBeenCalledTimes(2);
        expect(waits).toHaveLength(1);
    });

    it('does NOT retry a 400 — fails fast', async () => {
        const { sleep, waits } = spySleep();
        const fn = vi.fn().mockRejectedValue(apiError(400));
        await expect(withBackoff(fn, { sleep })).rejects.toMatchObject({ status: 400 });
        expect(fn).toHaveBeenCalledTimes(1);
        expect(waits).toHaveLength(0);
    });

    it('does NOT retry an abort', async () => {
        const { sleep } = spySleep();
        const fn = vi.fn().mockRejectedValue(Object.assign(new Error('aborted'), { name: 'AbortError' }));
        await expect(withBackoff(fn, { sleep })).rejects.toThrow('aborted');
        expect(fn).toHaveBeenCalledTimes(1);
    });

    it('gives up after maxAttempts on persistent 429', async () => {
        const { sleep, waits } = spySleep();
        const fn = vi.fn().mockRejectedValue(apiError(429));
        await expect(withBackoff(fn, { sleep, maxAttempts: 3 })).rejects.toMatchObject({ status: 429 });
        expect(fn).toHaveBeenCalledTimes(3);
        expect(waits).toHaveLength(2); // two waits between three attempts
    });

    it('honors Retry-After as a floor for the wait', async () => {
        const { sleep, waits } = spySleep();
        const fn = vi
            .fn()
            .mockRejectedValueOnce(apiError(429, { 'retry-after': '30' }))
            .mockResolvedValue('ok');
        await expect(withBackoff(fn, { sleep })).resolves.toBe('ok');
        expect(waits[0]).toBeGreaterThanOrEqual(30_000);
    });
});
