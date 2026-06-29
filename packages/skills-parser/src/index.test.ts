import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { parseFrontmatter, readSkillContent, discoverSkills } from './index';

let workspace: string;

beforeEach(() => {
    workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'csos-skills-'));
});

afterEach(() => {
    fs.rmSync(workspace, { recursive: true, force: true });
});

function writeLocalSkill(name: string, description: string): string {
    const dir = path.join(workspace, '.agents', 'skills', name);
    fs.mkdirSync(dir, { recursive: true });
    const file = path.join(dir, 'SKILL.md');
    fs.writeFileSync(file, `---\nname: ${name}\ndescription: ${description}\n---\n# ${name}\nbody`);
    return file;
}

describe('parseFrontmatter', () => {
    it('parses valid YAML frontmatter', () => {
        const meta = parseFrontmatter('---\nname: foo\ndescription: bar\n---\nbody');
        expect(meta).toEqual({ name: 'foo', description: 'bar' });
    });

    it('returns null when there is no frontmatter', () => {
        expect(parseFrontmatter('just text, no frontmatter')).toBeNull();
    });
});

describe('discoverSkills', () => {
    it('discovers a local workspace skill', () => {
        writeLocalSkill('greeter', 'says hi');
        const skills = discoverSkills(workspace);
        expect(skills.map((s) => s.name)).toContain('greeter');
    });
});

describe('readSkillContent (security)', () => {
    it('reads a SKILL.md that lives inside a valid skill root', () => {
        const file = writeLocalSkill('greeter', 'says hi');
        const content = readSkillContent(workspace, file);
        expect(content).toContain('# greeter');
    });

    it('refuses to read arbitrary absolute paths outside skill roots', () => {
        const secret = path.join(workspace, 'secret.env');
        fs.writeFileSync(secret, 'GEMINI_API_KEY=supersecret');
        const content = readSkillContent(workspace, secret);
        expect(content).toContain('Error de Seguridad');
        expect(content).not.toContain('supersecret');
    });

    it('refuses non-SKILL.md files even inside a skill root', () => {
        const dir = path.join(workspace, '.agents', 'skills', 'greeter');
        fs.mkdirSync(dir, { recursive: true });
        const sneaky = path.join(dir, 'notes.txt');
        fs.writeFileSync(sneaky, 'data');
        expect(readSkillContent(workspace, sneaky)).toContain('Error de Seguridad');
    });
});
