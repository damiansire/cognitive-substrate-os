export type Risk = 'safe' | 'dangerous';

export interface Classification {
    risk: Risk;
    /** The pattern that matched, when dangerous. */
    matched?: string;
}

/**
 * Patterns that mark a shell command as dangerous: destructive filesystem ops,
 * privilege escalation, network egress/exfiltration, permission changes, and
 * actions that publish or push outside the machine. This is a RISK SIGNAL used by
 * the approval gate — not a sandbox. Defense in depth, not the boundary itself.
 */
const DANGEROUS_PATTERNS: Array<{ name: string; re: RegExp }> = [
    { name: 'rm -rf', re: /\brm\s+-[rf]{1,2}\b/i },
    { name: 'del', re: /\bdel\b/i },
    { name: 'rmdir', re: /\brmdir\b/i },
    { name: 'format', re: /\bformat\b/i },
    { name: 'mkfs', re: /\bmkfs\b/i },
    { name: 'dd', re: /\bdd\s+if=/i },
    { name: 'sudo', re: /\bsudo\b/i },
    { name: 'chmod', re: /\bchmod\b/i },
    { name: 'chown', re: /\bchown\b/i },
    { name: 'curl', re: /\bcurl\b/i },
    { name: 'wget', re: /\bwget\b/i },
    { name: 'Invoke-WebRequest', re: /invoke-webrequest|iwr\b/i },
    { name: 'git push', re: /\bgit\s+push\b/i },
    { name: 'npm publish', re: /\bnpm\s+publish\b/i },
    { name: 'shutdown', re: /\b(shutdown|reboot|halt)\b/i },
    { name: 'redirect-to-device', re: />\s*\/dev\//i },
    { name: 'pipe-to-shell', re: /\|\s*(sh|bash|powershell|pwsh)\b/i }
];

/** Classifies a command's risk by matching it against the dangerous-pattern list. */
export function classifyCommand(command: string): Classification {
    const cmd = command ?? '';
    for (const { name, re } of DANGEROUS_PATTERNS) {
        if (re.test(cmd)) return { risk: 'dangerous', matched: name };
    }
    return { risk: 'safe' };
}
