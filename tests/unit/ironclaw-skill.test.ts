import { describe, expect, test } from 'bun:test';
import { fileURLToPath } from 'node:url';
import packageJson from '../../package.json';

function getSkillParts() {
  const skillPath = fileURLToPath(new URL('../../SKILL.md', import.meta.url));
  const raw = Bun.file(skillPath).text();
  return raw.then(content => {
    const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) {
      throw new Error('SKILL.md is missing YAML frontmatter');
    }
    return {
      frontmatter: match[1],
      body: match[2],
    };
  });
}

function getActivationList(frontmatter: string, key: string): string[] {
  const lines = frontmatter.split('\n');
  const results: string[] = [];
  let inActivation = false;
  let capture = false;

  for (const line of lines) {
    if (!inActivation) {
      if (line.trim() === 'activation:') {
        inActivation = true;
      }
      continue;
    }

    if (/^\S/.test(line)) {
      break;
    }

    if (new RegExp(`^  ${key}:\\s*$`).test(line)) {
      capture = true;
      continue;
    }

    if (capture && /^  [a-zA-Z_]/.test(line)) {
      break;
    }

    if (!capture) {
      continue;
    }

    const item = line.match(/^    -\s*(.+)$/);
    if (item) {
      results.push(item[1].trim().replace(/^['"]|['"]$/g, ''));
    }
  }

  return results;
}

function getActivationNumber(frontmatter: string, key: string): number | null {
  const match = frontmatter.match(new RegExp(`^  ${key}:\\s*(\\d+)$`, 'm'));
  return match ? Number(match[1]) : null;
}

describe('IronClaw skill prompt', () => {
  test('includes versioned frontmatter that matches package version', async () => {
    const { frontmatter } = await getSkillParts();
    expect(frontmatter).toContain('name: "aelfscan-skill"');
    expect(frontmatter).toContain(`version: "${packageJson.version}"`);
    expect(frontmatter).toContain('activation:');
  });

  test('defines activation keywords, exclusions, and tags for IronClaw routing', async () => {
    const { frontmatter } = await getSkillParts();
    const keywords = getActivationList(frontmatter, 'keywords');
    const excludeKeywords = getActivationList(frontmatter, 'exclude_keywords');
    const tags = getActivationList(frontmatter, 'tags');

    expect(keywords).toEqual(
      expect.arrayContaining(['explorer', 'analytics', 'search', 'address', 'token', 'nft']),
    );
    expect(excludeKeywords).toEqual(
      expect.arrayContaining(['transfer', 'swap', 'wallet', 'guardian', 'proposal']),
    );
    expect(tags).toEqual(expect.arrayContaining(['explorer', 'analytics', 'aelf', 'aelfscan']));
    expect(getActivationNumber(frontmatter, 'max_context_tokens')).toBe(1600);
  });

  test('documents read-only routing and explicit non-goals', async () => {
    const { body } = await getSkillParts();
    expect(body).toContain('Default to this skill for explorer, search, statistics');
    expect(body).toContain('This skill is read-only');
    expect(body).toContain('Do not use this skill for transfer, swap, wallet management');
    expect(body).toContain('Install into IronClaw');
  });
});
