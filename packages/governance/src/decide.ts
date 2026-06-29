import { classifyCommand } from './classify';
import type { Policy } from './policy';

export interface Decision {
    allowed: boolean;
    reason: string;
}

function matchesAny(command: string, patterns: string[]): string | undefined {
    const lowered = command.toLowerCase();
    return patterns.find((p) => p && lowered.includes(p.toLowerCase()));
}

/**
 * The approval gate. Decides whether a shell command may run, given a policy:
 *   1. explicit deny-list  → denied (always wins)
 *   2. explicit allow-list → allowed (overrides dangerous classification)
 *   3. dangerous + mode 'deny' → denied (needs human approval, absent here)
 *   4. otherwise → allowed
 *
 * Fail-safe: when in doubt about a dangerous command, deny.
 */
export function decideCommand(command: string, policy: Policy): Decision {
    const denyHit = matchesAny(command, policy.deny);
    if (denyHit) {
        return { allowed: false, reason: `denegado por la denylist de la política ("${denyHit}")` };
    }

    const allowHit = matchesAny(command, policy.allow);
    if (allowHit) {
        return { allowed: true, reason: `permitido por la allowlist de la política ("${allowHit}")` };
    }

    const classification = classifyCommand(command);
    if (classification.risk === 'dangerous') {
        if (policy.mode === 'allow') {
            return { allowed: true, reason: `comando peligroso (${classification.matched}) permitido por mode='allow'` };
        }
        return {
            allowed: false,
            reason: `comando peligroso (${classification.matched}) requiere aprobación humana; bloqueado en modo autónomo (mode='deny')`
        };
    }

    return { allowed: true, reason: 'comando seguro' };
}

/** Extracts the hostname from a URL, or null if it isn't a valid http(s) URL. */
export function urlDomain(url: string): string | null {
    try {
        const u = new URL(url);
        if (u.protocol !== 'http:' && u.protocol !== 'https:') return null;
        return u.hostname.toLowerCase();
    } catch {
        return null;
    }
}

/**
 * The egress gate for browser fetches. A URL is allowed only if its domain matches the
 * policy's `browserAllowDomains` (suffix match, so `example.com` covers `www.example.com`).
 * Empty allowlist → deny all (fail-safe: no silent network egress).
 */
export function decideUrl(url: string, policy: Policy): Decision {
    const domain = urlDomain(url);
    if (!domain) {
        return { allowed: false, reason: 'URL inválida o esquema no http(s)' };
    }
    const allowed = policy.browserAllowDomains.some(
        (d) => domain === d.toLowerCase() || domain.endsWith(`.${d.toLowerCase()}`)
    );
    return allowed
        ? { allowed: true, reason: `dominio ${domain} permitido` }
        : { allowed: false, reason: `dominio ${domain} no está en browserAllowDomains (egress denegado)` };
}
