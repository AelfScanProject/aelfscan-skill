import { describe, expect, test } from 'bun:test';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

describe('MCP tool annotations', () => {
  test('all AelfScan tools expose read-only annotations for IronClaw routing', async () => {
    const transport = new StdioClientTransport({
      command: 'bun',
      args: ['run', 'src/mcp/server.ts'],
      cwd: process.cwd(),
    });
    const client = new Client(
      {
        name: 'aelfscan-annotations-test',
        version: '1.0.0',
      },
      {
        capabilities: {},
      },
    );

    try {
      await client.connect(transport);
      const result = await client.listTools();

      expect(result.tools.length).toBeGreaterThan(0);
      result.tools.forEach(tool => {
        expect(tool.annotations?.readOnlyHint).toBe(true);
        expect(tool.annotations?.destructiveHint).not.toBe(true);
      });
    } finally {
      await client.close();
    }
  });
});
