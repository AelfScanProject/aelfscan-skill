import { describe, expect, test } from 'bun:test';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { TOOL_DESCRIPTORS } from '../../src/tooling/tool-descriptors.js';

const ROOT = path.resolve(import.meta.dir, '..', '..');
const OPENCLAW_PATH = path.join(ROOT, 'openclaw.json');
const MCP_SERVER_PATH = path.join(ROOT, 'src', 'mcp', 'server.ts');
const CLI_PATH = path.join(ROOT, 'aelfscan_skill.ts');

const TOOL_NAMES = TOOL_DESCRIPTORS.map(tool => tool.mcpName);

describe('tool surface', () => {
  test('descriptors are unique and complete', () => {
    const keys = new Set(TOOL_DESCRIPTORS.map(tool => tool.key));
    const mcpNames = new Set(TOOL_DESCRIPTORS.map(tool => tool.mcpName));

    expect(keys.size).toBe(TOOL_DESCRIPTORS.length);
    expect(mcpNames.size).toBe(TOOL_DESCRIPTORS.length);
    expect(keys.has('statistics.metric')).toBe(true);
  });

  test('openclaw includes all required tools', () => {
    const json = JSON.parse(fs.readFileSync(OPENCLAW_PATH, 'utf-8')) as {
      tools?: Array<{ name?: string }>;
    };

    const names = new Set((json.tools || []).map(tool => tool.name || ''));

    TOOL_NAMES.forEach((name) => {
      expect(names.has(name)).toBe(true);
    });

    expect(names.size).toBe(TOOL_DESCRIPTORS.length);
  });

  test('mcp and cli are descriptor-driven', () => {
    const source = fs.readFileSync(MCP_SERVER_PATH, 'utf-8');
    const cliSource = fs.readFileSync(CLI_PATH, 'utf-8');

    expect(source.includes('TOOL_DESCRIPTORS')).toBe(true);
    expect(source.includes('registerTool')).toBe(true);
    expect(source.includes('descriptor.mcpName')).toBe(true);
    expect(cliSource.includes('TOOL_DESCRIPTOR_BY_KEY')).toBe(true);
    expect(cliSource.includes('descriptor.parse')).toBe(true);
    expect(cliSource.includes('as any')).toBe(false);
  });
});
