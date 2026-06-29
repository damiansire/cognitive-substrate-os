import { describe, it, expect } from 'vitest';
import { buildDockerArgs, containerTools, DEFAULT_IMAGE } from './index';

describe('buildDockerArgs', () => {
    it('mounts the workspace, sets workdir, and disables network by default', () => {
        const argv = buildDockerArgs('/home/me/ws', 'ls -la');
        expect(argv).toContain('--rm');
        expect(argv).toEqual(expect.arrayContaining(['--network', 'none']));
        expect(argv).toEqual(expect.arrayContaining(['--workdir', '/workspace']));
        expect(argv).toEqual(expect.arrayContaining(['--volume', '/home/me/ws:/workspace']));
        expect(argv).toContain(DEFAULT_IMAGE);
        // command is passed to sh -c as the final argument
        expect(argv[argv.length - 1]).toBe('ls -la');
    });

    it('honors a custom image and bridge network', () => {
        const argv = buildDockerArgs('/ws', 'echo hi', { image: 'python:3.12', network: 'bridge' });
        expect(argv).toContain('python:3.12');
        expect(argv).toEqual(expect.arrayContaining(['--network', 'bridge']));
    });
});

describe('containerTools.runCommand (fail-safe)', () => {
    it('refuses to run (does NOT fall back to host) when Docker is unavailable', async () => {
        const out = await containerTools.runCommand('/ws', { command: 'whoami' }, {}, async () => false);
        expect(out).toContain('Docker no está disponible');
        expect(out).toContain('Fail-safe');
    });
});
