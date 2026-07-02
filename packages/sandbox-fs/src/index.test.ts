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

/**
 * Attempts a directory symlink (Windows junctions need no elevation; POSIX uses 'dir').
 * Returns false if the platform refuses it (e.g. Windows without Developer Mode), so the
 * symlink tests skip rather than fail on a permissions quirk.
 */
function trySymlinkDir(target: string, link: string): boolean {
    try {
        fs.symlinkSync(target, link, process.platform === 'win32' ? 'junction' : 'dir');
        return true;
    } catch {
        return false;
    }
}

describe('resolveInsideWorkspace (symlink-aware invariant)', () => {
    // These pin the one claim the current tests never exercised: a symlink INSIDE the
    // workspace that points OUTSIDE it must not become an escape hatch. The whole reason
    // resolveInsideWorkspace resolves realpath instead of a textual check.
    it('rejects reading through a symlink that points outside the workspace', () => {
        const outside = `${workspace}-outside`;
        fs.mkdirSync(outside, { recursive: true });
        fs.writeFileSync(path.join(outside, 'secret.txt'), 'top secret');
        const linkInside = path.join(workspace, 'escape-link');
        if (!trySymlinkDir(outside, linkInside)) {
            console.warn('symlink no permitido en esta plataforma — test omitido');
            fs.rmSync(outside, { recursive: true, force: true });
            return;
        }
        try {
            // Reading an existing file through the link must be denied...
            expect(() => resolveInsideWorkspace(workspace, path.join('escape-link', 'secret.txt'))).toThrow(
                SandboxEscapeError
            );
            // ...and so must the fsTools surface (returns the security message).
            expect(fsTools.readFile(workspace, { filepath: 'escape-link/secret.txt' })).toContain('Error de Seguridad');
        } finally {
            fs.rmSync(linkInside, { recursive: true, force: true });
            fs.rmSync(outside, { recursive: true, force: true });
        }
    });

    it('rejects writing a NEW file through a symlink that points outside the workspace', () => {
        const outside = `${workspace}-outside2`;
        fs.mkdirSync(outside, { recursive: true });
        const linkInside = path.join(workspace, 'escape-link2');
        if (!trySymlinkDir(outside, linkInside)) {
            console.warn('symlink no permitido en esta plataforma — test omitido');
            fs.rmSync(outside, { recursive: true, force: true });
            return;
        }
        try {
            // The target file doesn't exist yet: resolution must still resolve the link's
            // real target and deny, never plant a file outside the workspace.
            expect(() => resolveInsideWorkspace(workspace, path.join('escape-link2', 'planted.txt'))).toThrow(
                SandboxEscapeError
            );
            expect(fsTools.writeFile(workspace, { filepath: 'escape-link2/planted.txt', content: 'x' })).toContain(
                'Error de Seguridad'
            );
            expect(fs.existsSync(path.join(outside, 'planted.txt'))).toBe(false);
        } finally {
            fs.rmSync(linkInside, { recursive: true, force: true });
            fs.rmSync(outside, { recursive: true, force: true });
        }
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
