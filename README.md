# AelfScan Skill Kit

AelfScan explorer skill toolkit for AI agents, with **SDK + MCP + CLI + OpenClaw** interfaces.

## Features

- Search: filters and multi-entity search (tokens/accounts/contracts/NFTs/blocks/transactions)
- Blockchain: blocks, latest blocks, transactions, latest transactions, block detail, transaction detail, overview/chart/address dictionary/log events
- Address: accounts, contracts, address detail, token/NFT assets, transfers, contract history/events/source
- Token: token list/detail/transfers/holders
- NFT: collections/detail/transfers/holders/inventory/item detail/item holders/item activity
- Statistics: daily transactions/addresses/activity, produce metrics, fees/reward/burn, supply/market/staking/TVL, node/ELF supply and date-range summary APIs
- Metadata-driven tool registry: one source of truth for SDK/CLI/MCP/OpenClaw
- MCP output governance: array truncation + max chars + configurable raw payload inclusion
- Unified output shape: `ToolResult<T>` with `traceId`, standardized errors, and `raw` payload

## Architecture

```text
aelfscan-skill/
├── index.ts                 # SDK exports
├── aelfscan_skill.ts        # CLI adapter
├── src/
│   ├── core/                # Domain logic (search/blockchain/address/token/nft/statistics)
│   ├── tooling/             # Single source tool descriptors
│   └── mcp/                 # MCP adapter + output policy
├── lib/                     # Config/http/errors/trace/types
├── bin/setup.ts             # Setup for claude/cursor/openclaw
├── openclaw.json
├── mcp-config.example.json
└── tests/                   # unit/integration/e2e
```

## Quick Start

### Install

```bash
bun install
```

### Configure

```bash
cp .env.example .env
```

### Run MCP

```bash
bun run mcp
```

### Run CLI

```bash
bun run aelfscan_skill.ts search query --input '{"chainId":"AELF","keyword":"ELF","filterType":0,"searchType":0}'
bun run aelfscan_skill.ts blockchain blocks --input '{"chainId":"AELF","maxResultCount":2,"skipCount":0}'
bun run aelfscan_skill.ts blockchain overview --input '{"chainId":"AELF"}'
bun run aelfscan_skill.ts blockchain log-events --input '{"chainId":"AELF","contractAddress":"256MtWxt3dvxBUdh1XHjQeeSDm2SMR98gDQxLL4UXjwFDhzcAM","maxResultCount":1,"skipCount":0}'
bun run aelfscan_skill.ts address detail --input '{"chainId":"AELF","address":"JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE"}'
bun run aelfscan_skill.ts statistics daily-transactions --input '{"chainId":"AELF"}'
bun run aelfscan_skill.ts statistics daily-transaction-info --input '{"chainId":"AELF","startDate":"2026-02-20","endDate":"2026-02-26"}'
bun run aelfscan_skill.ts statistics metric --input '{"metric":"dailyTransactions","chainId":"AELF"}'
```

## MCP Config Example

Use [`mcp-config.example.json`](./mcp-config.example.json).

## Setup Helper

```bash
bun run setup claude
bun run setup cursor
bun run setup cursor --global
bun run setup openclaw
bun run setup list
bun run build:openclaw
```

## Tests

```bash
bun run test:unit
bun run test:unit:coverage
bun run coverage:badge
bun run test:integration
bun run test:e2e

# live smoke (optional)
RUN_LIVE_TESTS=1 bun run test:e2e
```

## Environment Variables

- `AELFSCAN_API_BASE_URL` (default: `https://aelfscan.io`)
- `AELFSCAN_DEFAULT_CHAIN_ID` (default: empty for multi-chain)
- `AELFSCAN_TIMEOUT_MS` (default: `10000`)
- `AELFSCAN_RETRY` (default: `1`)
- `AELFSCAN_RETRY_BASE_MS` (default: `200`)
- `AELFSCAN_RETRY_MAX_MS` (default: `3000`)
- `AELFSCAN_MAX_CONCURRENT_REQUESTS` (default: `5`)
- `AELFSCAN_CACHE_TTL_MS` (default: `60000`)
- `AELFSCAN_CACHE_MAX_ENTRIES` (default: `500`)
- `AELFSCAN_MAX_RESULT_COUNT` (default: `200`)
- `AELFSCAN_MCP_MAX_ITEMS` (default: `50`)
- `AELFSCAN_MCP_MAX_CHARS` (default: `60000`)
- `AELFSCAN_MCP_INCLUDE_RAW` (default: `false`)

## License

MIT
