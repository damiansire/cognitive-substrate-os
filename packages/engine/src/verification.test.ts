import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { referencedFiles, deterministicChecks, verifyTask } from './verification';

let workspace: string;
let savedKey: string | undefined;
beforeEach(() => {
    workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'csos-ver-'));
    savedKey = process.env['GEMINI_API_KEY'];
    delete process.env['GEMINI_API_KEY']; // force simulation
});
afterEach(() => {
    fs.rmSync(workspace, { recursive: true, force: true });
    if (savedKey !== undefined) process.env['GEMINI_API_KEY'] = savedKey;
});

describe('referencedFiles', () => {
    it('extracts file-like tokens from a task', () => {
        const files = referencedFiles('Crear app.js y public/index.html');
        expect(files).toContain('app.js');
        expect(files).toContain('public/index.html');
    });
});

describe('deterministicChecks', () => {
    it('fails when a referenced file is missing', () => {
        const checks = deterministicChecks(workspace, 'Crear app.js', 'log', true);
        const fileCheck = checks.find((c) => c.name === 'archivo-existe:app.js');
        expect(fileCheck?.passed).toBe(false);
    });

    it('passes when the referenced file exists', () => {
        fs.writeFileSync(path.join(workspace, 'app.js'), '// hi');
        const checks = deterministicChecks(workspace, 'Crear app.js', 'log', true);
        const fileCheck = checks.find((c) => c.name === 'archivo-existe:app.js');
        expect(fileCheck?.passed).toBe(true);
    });
});

describe('verifyTask (simulation mode)', () => {
    it('verifies when execution succeeded and no missing evidence', async () => {
        const verdict = await verifyTask(workspace, 'Tarea simple', 'hice la tarea', true);
        expect(verdict.verified).toBe(true);
    });

    it('does not verify when execution failed', async () => {
        const verdict = await verifyTask(workspace, 'Tarea simple', '', false);
        expect(verdict.verified).toBe(false);
    });

    it('does not verify when a referenced file is missing', async () => {
        const verdict = await verifyTask(workspace, 'Crear faltante.txt', 'dije que lo hice', true);
        expect(verdict.verified).toBe(false);
    });
});
