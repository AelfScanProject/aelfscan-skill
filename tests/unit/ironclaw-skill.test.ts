import { describe, expect, test } from 'bun:test';
import { fileURLToPath } from 'node:url';

function getSkillParts() {
  const skillPath = fileURLToPath(new URL('../../SKILL.md', import.meta.url));
  return Bun.file(skillPath).text().then((content) => {
    const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) throw new Error('SKILL.md is missing YAML frontmatter');
    return { frontmatter: match[1], body: match[2] };
  });
}

function getTopLevelKeys(frontmatter: string): string[] {
  return frontmatter.split('\n').flatMap((line) => {
    const match = line.match(/^([a-zA-Z][\w-]*):/);
    return match ? [match[1]] : [];
  });
}

function getFrontmatterValue(frontmatter: string, key: string): string {
  return frontmatter.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'))?.[1]?.trim() ?? '';
}

describe('IronClaw skill prompt', () => {
  test('uses only Codex-supported frontmatter fields', async () => {
    const { frontmatter } = await getSkillParts();
    expect(getTopLevelKeys(frontmatter)).toEqual(['name', 'description']);
    expect(getFrontmatterValue(frontmatter, 'name')).toBe('aelfscan-skill');
  });

  test('routes explorer work through the description', async () => {
    const { frontmatter } = await getSkillParts();
    const description = getFrontmatterValue(frontmatter, 'description').toLowerCase();
    expect(description).toContain('explorer');
    expect(description).toContain('analytics');
    expect(description).toContain('token');
    expect(description).toContain('wallet');
    expect(description).toContain('dex');
  });

  test('documents read-only behavior and activation', async () => {
    const { body } = await getSkillParts();
    expect(body).toContain('This skill is read-only');
    expect(body).toContain('Do not use this skill for transfer, swap, wallet management');
    expect(body).toContain('Install into IronClaw');
  });
});
