---
name: aelfscan-skill
description: AelfScan explorer retrieval and analytics for search, blocks, transactions, addresses, contracts, tokens, NFTs, statistics, historical charts, and network metrics. Use for indexed or aggregated AElf data; use a node skill for raw RPC calls and wallet or domain skills for state-changing operations.
---

# AelfScan Skill

## Capabilities
- Domain coverage: search, blockchain, address, token, NFT, statistics
- Single tool descriptor source for SDK/CLI/MCP/OpenClaw
- Supports SDK, CLI, MCP, OpenClaw, and IronClaw integration from one codebase.
- MCP output governance controls and standardized trace-aware errors

## Online configuration
- The public API default is `https://aelfscan.io`; no API key or signer is required.
- Set `AELFSCAN_API_BASE_URL` only for an alternate deployment. An empty `AELFSCAN_DEFAULT_CHAIN_ID` keeps queries multi-chain; callers may pass `AELF`, `tDVV`, or `tDVW` per request.
- This explorer skill has no contract-address configuration because it reads indexed HTTP data instead of submitting contract calls.
- Timeout, retry, concurrency, cache, pagination, and MCP output limits are documented in the packaged `.env.example`.

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

## Distribution / Activation
- GitHub repo/tree URLs are discovery-only for hosts and agents.
- Preferred IronClaw activation from npm: `bunx -p @aelfscan/agent-skills aelfscan-setup ironclaw`
- Preferred OpenClaw activation from npm when managed install is unavailable: `bunx -p @aelfscan/agent-skills aelfscan-setup openclaw`
- Local repo checkout is for development and smoke tests only.

## Limits / Non-goals
- This skill focuses on domain operations and adapters; it is not a full wallet custody system.
- It does not consume signer context for transaction signing.
- Do not hardcode environment secrets in source code or docs.
- Avoid bypassing validation for external service calls.
