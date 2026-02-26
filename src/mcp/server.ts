#!/usr/bin/env bun
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { asMcpResult } from './output.js';
import { TOOL_DESCRIPTORS } from '../tooling/tool-descriptors.js';

const server = new McpServer({
  name: 'aelfscan-skill',
  version: '0.2.0',
});

for (const descriptor of TOOL_DESCRIPTORS) {
  server.registerTool(
    descriptor.mcpName,
    {
      description: descriptor.description,
      inputSchema: descriptor.inputSchema,
    },
    async (input: Record<string, unknown>) => {
      const validatedInput = descriptor.parse(input);
      const result = await descriptor.handler(validatedInput);
      return asMcpResult(result, descriptor.outputPolicy);
    },
  );
}

const transport = new StdioServerTransport();
await server.connect(transport);
