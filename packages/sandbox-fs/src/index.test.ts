import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { fsTools, resolveInsideWorkspace, SandboxEscapeError } from './index';

let workspace: string;

beforeEach(() => {
    workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'csos-fs-'));
});

afterEach(() => {
    fs.rmSync(workspace, { recursive: true, force: true });
    // Clean up the sibling "-evil" dir used by the prefix-bypass test, if created.
    fs.rmSync(`${workspace}-evil`, { recursive: true, force: true });
});

describe('resolveInsideWorkspace (security invariant)', () => {
    it('accepts legitimate paths inside the workspace', () => {
        const target = resolveInsideWorkspace(workspace, 'sub/dir/file.txt');
        expect(target.startsWith(fs.realpathSync(workspace))).toBe(true);
    });

    it('rejects parent-directory traversal', () => {
        expect(() => resolveInsideWorkspace(workspace, '../escape.txt')).toThrow(SandboxEscapeError);
        expect(() => resolveInsideWorkspace(workspace, '../../etc/passwd')).toThrow(SandboxEscapeError);
    });

    it('rejects absolute paths', () => {
        const absolute = process.platform === 'win32' ? 'C:\\Windows\\System32' : '/etc/passwd';
        expect(() => resolveInsideWorkspace(workspace, absolute)).toThrow(SandboxEscapeError);
    });

    it('rejects the classic startsWith prefix bypass (workspace-evil)', () => {
        // The old `target.startsWith(workspacePath)` check let `/ws-evil` pass for `/ws`.
        const sibling = `${workspace}-evil`;
        fs.mkdirSync(sibling, { recursive: true });
        fs.writeFileSync(path.join(sibling, 'secret.txt'), 'top secret');
        const escapeRelative = path.join('..', `${path.basename(workspace)}-evil`, 'secret.txt');
        expect(() => resolveInsideWorkspace(workspace, escapeRelative)).toThrow(SandboxEscapeError);
    });
});

describe('fsTools', () => {
    it('writes and reads a file inside the workspace', () => {
        const write = fsTools.writeFile(workspace, { filepath: 'notes/hello.txt', content: 'hola' });
        expect(write).toContain('Success');
        const read = fsTools.readFile(workspace, { filepath: 'notes/hello.txt' });
        expect(read).toBe('hola');
    });

    it('returns a security error instead of reading outside the workspace', () => {
        const read = fsTools.readFile(workspace, { filepath: '../../../../etc/passwd' });
        expect(read).toContain('Error de Seguridad');
    });

    it('returns a security error instead of writing outside the workspace', () => {
        const write = fsTools.writeFile(workspace, { filepath: '../evil.txt', content: 'x' });
        expect(write).toContain('Error de Seguridad');
        expect(fs.existsSync(`${workspace}-evil.txt`)).toBe(false);
        expect(fs.existsSync(path.join(path.dirname(workspace), 'evil.txt'))).toBe(false);
    });

    it('lists files within the workspace', () => {
        fsTools.writeFile(workspace, { filepath: 'a.txt', content: '1' });
        fsTools.writeFile(workspace, { filepath: 'b.txt', content: '2' });
        const listing = fsTools.listFiles(workspace, { dirpath: '.' });
        expect(listing).toContain('a.txt');
        expect(listing).toContain('b.txt');
    });
});
