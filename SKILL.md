---
name: "aelfscan-skill"
version: "0.2.2"
description: "AelfScan explorer data retrieval and analytics skill for agents."
activation:
  keywords:
    - explorer
    - analytics
    - search
    - address
    - token
    - nft
    - statistics
    - block
    - transaction
  exclude_keywords:
    - transfer
    - swap
    - wallet
    - guardian
    - proposal
  tags:
    - explorer
    - analytics
    - aelf
    - aelfscan
  max_context_tokens: 1600
---

# AelfScan Skill

## When to use
- Use this skill when you need AelfScan explorer search and analytics data retrieval tasks.
- Default to this skill for explorer, search, statistics, and historical analysis requests on aelf.

## Capabilities
- Domain coverage: search, blockchain, address, token, NFT, statistics
- Single tool descriptor source for SDK/CLI/MCP/OpenClaw
- Supports SDK, CLI, MCP, OpenClaw, and IronClaw integration from one codebase.
- MCP output governance controls and standardized trace-aware errors

## Safe usage rules
- Never print private keys, mnemonics, or tokens in channel outputs.
- This skill is read-only; do not attempt to execute chain writes via this package.
- If user intent requires writes, route to wallet + domain write skills and keep this skill for analytics.
- Do not use this skill for transfer, swap, wallet management, guardian, or governance write workflows.

## Command recipes
- Start MCP server: `bun run mcp`
- Run CLI entry: `bun run cli`
- Install into IronClaw: `bun run setup ironclaw`
- Generate OpenClaw config: `bun run build:openclaw`
- Verify OpenClaw config: `bun run build:openclaw:check`
- Run CI coverage gate: `bun run test:coverage:ci`

## Limits / Non-goals
- This skill focuses on domain operations and adapters; it is not a full wallet custody system.
- It does not consume signer context for transaction signing.
- Do not hardcode environment secrets in source code or docs.
- Avoid bypassing validation for external service calls.
