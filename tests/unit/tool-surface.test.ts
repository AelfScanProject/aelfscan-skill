import { describe, expect, test } from 'bun:test';
import * as fs from 'node:fs';
import * as path from 'node:path';

const ROOT = path.resolve(import.meta.dir, '..', '..');
const OPENCLAW_PATH = path.join(ROOT, 'openclaw.json');
const MCP_SERVER_PATH = path.join(ROOT, 'src', 'mcp', 'server.ts');

const TOOL_NAMES = [
  'aelfscan_search_filters',
  'aelfscan_search',
  'aelfscan_blocks',
  'aelfscan_blocks_latest',
  'aelfscan_block_detail',
  'aelfscan_transactions',
  'aelfscan_transactions_latest',
  'aelfscan_transaction_detail',
  'aelfscan_blockchain_overview',
  'aelfscan_transaction_data_chart',
  'aelfscan_address_dictionary',
  'aelfscan_log_events',
  'aelfscan_accounts',
  'aelfscan_contracts',
  'aelfscan_address_detail',
  'aelfscan_address_tokens',
  'aelfscan_address_nft_assets',
  'aelfscan_address_transfers',
  'aelfscan_contract_history',
  'aelfscan_contract_events',
  'aelfscan_contract_source',
  'aelfscan_tokens',
  'aelfscan_token_detail',
  'aelfscan_token_transfers',
  'aelfscan_token_holders',
  'aelfscan_nft_collections',
  'aelfscan_nft_collection_detail',
  'aelfscan_nft_transfers',
  'aelfscan_nft_holders',
  'aelfscan_nft_inventory',
  'aelfscan_nft_item_detail',
  'aelfscan_nft_item_holders',
  'aelfscan_nft_item_activity',
  'aelfscan_statistics_daily_transactions',
  'aelfscan_statistics_unique_addresses',
  'aelfscan_statistics_daily_active_addresses',
  'aelfscan_statistics_monthly_active_addresses',
  'aelfscan_statistics_block_produce_rate',
  'aelfscan_statistics_avg_block_duration',
  'aelfscan_statistics_cycle_count',
  'aelfscan_statistics_node_block_produce',
  'aelfscan_statistics_daily_avg_transaction_fee',
  'aelfscan_statistics_daily_tx_fee',
  'aelfscan_statistics_daily_total_burnt',
  'aelfscan_statistics_daily_elf_price',
  'aelfscan_statistics_daily_deploy_contract',
  'aelfscan_statistics_daily_block_reward',
  'aelfscan_statistics_daily_avg_block_size',
  'aelfscan_statistics_top_contract_call',
  'aelfscan_statistics_daily_contract_call',
  'aelfscan_statistics_daily_supply_growth',
  'aelfscan_statistics_daily_market_cap',
  'aelfscan_statistics_daily_staked',
  'aelfscan_statistics_daily_holder',
  'aelfscan_statistics_daily_tvl',
  'aelfscan_statistics_node_current_produce_info',
  'aelfscan_statistics_elf_supply',
  'aelfscan_statistics_daily_transaction_info',
  'aelfscan_statistics_daily_activity_address',
  'aelfscan_statistics_currency_price',
];

describe('tool surface', () => {
  test('openclaw includes all required tools', () => {
    const json = JSON.parse(fs.readFileSync(OPENCLAW_PATH, 'utf-8')) as {
      tools?: Array<{ name?: string }>;
    };

    const names = new Set((json.tools || []).map(tool => tool.name || ''));

    TOOL_NAMES.forEach((name) => {
      expect(names.has(name)).toBe(true);
    });
  });

  test('mcp registers all required tools', () => {
    const source = fs.readFileSync(MCP_SERVER_PATH, 'utf-8');

    TOOL_NAMES.forEach((name) => {
      expect(source.includes(`'${name}'`)).toBe(true);
    });
  });
});
