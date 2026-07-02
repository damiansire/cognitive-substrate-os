import { describe, it, expect, vi } from 'vitest';

// Isolated in its own file: mocking one engine export would otherwise perturb the 27
// real-integration tests in router.test.ts. `importActual` keeps every other export real
// (resolveWorkspaces must still find the workspace) and only `getInboxItems` throws.
vi.mock('@cognitive-substrate/engine', async () => {
    const actual = await vi.importActual<typeof import('@cognitive-substrate/engine')>('@cognitive-substrate/engine');
    return {
        ...actual,
        getInboxItems: () => {
            throw new Error('disco explotó');
        }
    };
});

import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { handleApiRequest } from './router';

describe('router error boundary', () => {
    it('turns an exception from the read-model into a 500 instead of a rejected promise', async () => {
        const root = fs.mkdtempSync(path.join(os.tmpdir(), 'csos-errboundary-'));
        fs.writeFileSync(
            path.join(root, 'tasks.md'),
            '# Plan\n\n## [now]\n- [ ] Tarea A\n\n## [next]\n\n## [blocked]\n\n## [improve]\n\n## [recurring]\n'
        );
        try {
            const project = path.basename(root);
            const res = await handleApiRequest(root, 'GET', `/api/workspaces/${project}/inbox`, new URLSearchParams());
            expect(res.status).toBe(500);
            expect((res.payload as { error: string }).error).toBe('error interno del servidor');
        } finally {
            fs.rmSync(root, { recursive: true, force: true });
        }
    });
});
