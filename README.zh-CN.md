# AelfScan Skill Kit

[中文](./README.zh-CN.md) | [English](./README.md)

[![Unit Tests](https://github.com/AelfScanProject/aelfscan-skill/actions/workflows/test.yml/badge.svg)](https://github.com/AelfScanProject/aelfscan-skill/actions/workflows/test.yml)
[![Coverage](https://img.shields.io/endpoint?url=https://AelfScanProject.github.io/aelfscan-skill/coverage-badge.json)](https://AelfScanProject.github.io/aelfscan-skill/coverage-badge.json)

面向 AI Agent 的 AelfScan 浏览器能力工具包，提供 **SDK + MCP + CLI + OpenClaw + IronClaw** 五种使用方式。

## 功能覆盖

- Search：筛选器与多实体搜索（token/account/contract/NFT/block/transaction）
- Blockchain：区块列表、最新区块、交易列表、最新交易、区块详情、交易详情、overview/chart/address dictionary/log events
- Address：账户/合约列表，地址详情，Token/NFT 资产，转账记录，合约历史/事件/源码
- Token：列表、详情、转账、持有人
- NFT：合集列表/详情、转账、持有人、库存、Item 详情/持有人/活动
- Statistics：交易/地址活跃度、产块指标、手续费/奖励/销毁、供给/市值/质押/TVL、节点与 ELF 供给、按日期区间汇总
- 单一元数据源：SDK/CLI/MCP/OpenClaw 共用 tool descriptor
- MCP 输出治理：数组截断 + 文本长度上限 + `raw` 可配置
- 统一返回模型：`ToolResult<T>`，包含 `traceId`、标准化错误和 `raw` 原始响应

## 架构

```text
aelfscan-skill/
├── index.ts                 # SDK 导出
├── aelfscan_skill.ts        # CLI 适配层
├── src/
│   ├── core/                # 域逻辑（search/blockchain/address/token/nft/statistics）
│   ├── tooling/             # Tool descriptor 单一真源
│   └── mcp/                 # MCP 适配层与输出治理
├── lib/                     # config/http/errors/trace/types
├── bin/setup.ts             # claude/cursor/openclaw 一键配置
├── openclaw.json
├── mcp-config.example.json
└── tests/                   # unit/integration/e2e
```

## 快速开始

### 安装

```bash
bun install
```

### 环境变量

```bash
cp .env.example .env
```

### 启动 MCP

```bash
bun run mcp
```

### OpenClaw

```bash
bun run build:openclaw
bun run build:openclaw:check
```

### CLI 示例

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

## MCP 配置模板

参考 [`mcp-config.example.json`](./mcp-config.example.json)。

## 一键配置命令

```bash
bun run setup claude
bun run setup cursor
bun run setup cursor --global
bun run setup ironclaw
bun run setup openclaw
bun run setup list
bun run build:openclaw
```

## IronClaw

```bash
bun run setup ironclaw
bun run setup uninstall ironclaw
```

IronClaw 安装会向 `~/.ironclaw/mcp-servers.json` 写入 stdio MCP entry，并把当前仓库的 `SKILL.md` 安装到 `~/.ironclaw/skills/aelfscan-skill/SKILL.md`。

关于 trust model 的说明：

- 即使这是只读 skill，也建议走上面的 trusted skill 路径，保证路由稳定。
- 不要把 `~/.ironclaw/installed_skills/` 当成主安装路径。
- 当前 MCP server 会同时输出标准 MCP camelCase annotations 和 IronClaw 兼容 snake_case annotations，确保 IronClaw 能识别 read-only hint。

远程激活契约：

- GitHub repo/tree URL 只用于 discovery，不是最终的 IronClaw 安装载体。
- 推荐的 IronClaw npm 激活命令：`bunx -p @aelfscan/agent-skills aelfscan-setup ironclaw`
- OpenClaw 若有 ClawHub / managed install 则优先使用；否则回退到 `bunx -p @aelfscan/agent-skills aelfscan-setup openclaw`
- 本地 repo checkout 仅保留给开发阶段 smoke test。

最短 smoke test：

1. `bun run setup ironclaw`
2. 让 IronClaw 查询 AelfScan 浏览器数据，例如 `latest ELF transactions`
3. 确认 analytics/search prompt 会命中该 skill，且整个能力保持只读

## 测试

```bash
bun run test:unit
bun run test:unit:coverage
bun run coverage:badge
bun run test:integration
bun run test:e2e

# 可选：线上只读烟测
RUN_LIVE_TESTS=1 bun run test:e2e
```

## 环境变量说明

- `AELFSCAN_API_BASE_URL`（默认 `https://aelfscan.io`）
- `AELFSCAN_DEFAULT_CHAIN_ID`（默认空字符串，表示 multi-chain）
- `AELFSCAN_TIMEOUT_MS`（默认 `10000`）
- `AELFSCAN_RETRY`（默认 `1`）
- `AELFSCAN_RETRY_BASE_MS`（默认 `200`）
- `AELFSCAN_RETRY_MAX_MS`（默认 `3000`）
- `AELFSCAN_MAX_CONCURRENT_REQUESTS`（默认 `5`）
- `AELFSCAN_CACHE_TTL_MS`（默认 `60000`）
- `AELFSCAN_CACHE_MAX_ENTRIES`（默认 `500`）
- `AELFSCAN_MAX_RESULT_COUNT`（默认 `200`）
- `AELFSCAN_MCP_MAX_ITEMS`（默认 `50`）
- `AELFSCAN_MCP_MAX_CHARS`（默认 `60000`）
- `AELFSCAN_MCP_INCLUDE_RAW`（默认 `false`）

## 钱包上下文兼容性

- 本 skill 为只读，不消费 signer/private-key 上下文，也不执行链上写操作。
- 兼容写能力 skill 使用的共享 wallet-context 协议（`~/.portkey/skill-wallet/context.v1.json`）。
- 当本地存在 context 文件时，`bun run deps:check` 会校验 wallet-context schema 版本。

## License

MIT

## 安全

- API Token 和私钥仅通过环境变量或配置注入。
- 工具输出中禁止泄露敏感字段。
