#!/usr/bin/env bun
import { Command } from 'commander';
import {
  getAccounts,
  getAddressDetail,
  getAddressDictionary,
  getAddressNftAssets,
  getAddressTokens,
  getAddressTransfers,
  getAvgBlockDuration,
  getBlockDetail,
  getBlockchainOverview,
  getBlockProduceRate,
  getBlocks,
  getCurrencyPrice,
  getCycleCount,
  getDailyActiveAddresses,
  getDailyActivityAddress,
  getDailyAvgBlockSize,
  getDailyAvgTransactionFee,
  getDailyBlockReward,
  getDailyContractCall,
  getDailyDeployContract,
  getDailyElfPrice,
  getDailyHolder,
  getDailyMarketCap,
  getDailyStaked,
  getDailySupplyGrowth,
  getDailyTotalBurnt,
  getDailyTransactionInfo,
  getDailyTransactions,
  getDailyTvl,
  getDailyTxFee,
  getElfSupply,
  getContractEvents,
  getContractHistory,
  getContracts,
  getContractSource,
  getLatestBlocks,
  getLatestTransactions,
  getLogEvents,
  getMonthlyActiveAddresses,
  getNftCollectionDetail,
  getNftCollections,
  getNftHolders,
  getNftInventory,
  getNftItemActivity,
  getNftItemDetail,
  getNftItemHolders,
  getNftTransfers,
  getSearchFilters,
  getTokenDetail,
  getTokenHolders,
  getTokens,
  getTokenTransfers,
  getTopContractCall,
  getTransactionDataChart,
  getTransactionDetail,
  getTransactions,
  getUniqueAddresses,
  getNodeBlockProduce,
  getNodeCurrentProduceInfo,
  search,
} from './index.js';
import type { ToolResult } from './lib/types.js';

type Handler = (input: Record<string, unknown>) => Promise<ToolResult<unknown>>;

const handlers: Record<string, Handler> = {
  'search.filters': async (input) => getSearchFilters(input),
  'search.query': async (input) => search(input as any),

  'blockchain.blocks': async (input) => getBlocks(input),
  'blockchain.blocks-latest': async (input) => getLatestBlocks(input),
  'blockchain.block-detail': async (input) => getBlockDetail(input as any),
  'blockchain.transactions': async (input) => getTransactions(input),
  'blockchain.transactions-latest': async (input) => getLatestTransactions(input),
  'blockchain.transaction-detail': async (input) => getTransactionDetail(input as any),
  'blockchain.overview': async (input) => getBlockchainOverview(input),
  'blockchain.transaction-data-chart': async (input) => getTransactionDataChart(input),
  'blockchain.address-dictionary': async (input) => getAddressDictionary(input as any),
  'blockchain.log-events': async (input) => getLogEvents(input as any),

  'address.accounts': async (input) => getAccounts(input),
  'address.contracts': async (input) => getContracts(input),
  'address.detail': async (input) => getAddressDetail(input as any),
  'address.tokens': async (input) => getAddressTokens(input as any),
  'address.nft-assets': async (input) => getAddressNftAssets(input as any),
  'address.transfers': async (input) => getAddressTransfers(input as any),
  'address.contract-history': async (input) => getContractHistory(input as any),
  'address.contract-events': async (input) => getContractEvents(input as any),
  'address.contract-source': async (input) => getContractSource(input as any),

  'token.list': async (input) => getTokens(input),
  'token.detail': async (input) => getTokenDetail(input as any),
  'token.transfers': async (input) => getTokenTransfers(input as any),
  'token.holders': async (input) => getTokenHolders(input),

  'nft.collections': async (input) => getNftCollections(input),
  'nft.collection-detail': async (input) => getNftCollectionDetail(input as any),
  'nft.transfers': async (input) => getNftTransfers(input as any),
  'nft.holders': async (input) => getNftHolders(input as any),
  'nft.inventory': async (input) => getNftInventory(input as any),
  'nft.item-detail': async (input) => getNftItemDetail(input as any),
  'nft.item-holders': async (input) => getNftItemHolders(input as any),
  'nft.item-activity': async (input) => getNftItemActivity(input as any),

  'statistics.daily-transactions': async (input) => getDailyTransactions(input),
  'statistics.unique-addresses': async (input) => getUniqueAddresses(input),
  'statistics.daily-active-addresses': async (input) => getDailyActiveAddresses(input),
  'statistics.monthly-active-addresses': async (input) => getMonthlyActiveAddresses(input),
  'statistics.block-produce-rate': async (input) => getBlockProduceRate(input),
  'statistics.avg-block-duration': async (input) => getAvgBlockDuration(input),
  'statistics.cycle-count': async (input) => getCycleCount(input),
  'statistics.node-block-produce': async (input) => getNodeBlockProduce(input),
  'statistics.daily-avg-transaction-fee': async (input) => getDailyAvgTransactionFee(input),
  'statistics.daily-tx-fee': async (input) => getDailyTxFee(input),
  'statistics.daily-total-burnt': async (input) => getDailyTotalBurnt(input),
  'statistics.daily-elf-price': async (input) => getDailyElfPrice(input),
  'statistics.daily-deploy-contract': async (input) => getDailyDeployContract(input),
  'statistics.daily-block-reward': async (input) => getDailyBlockReward(input),
  'statistics.daily-avg-block-size': async (input) => getDailyAvgBlockSize(input),
  'statistics.top-contract-call': async (input) => getTopContractCall(input),
  'statistics.daily-contract-call': async (input) => getDailyContractCall(input),
  'statistics.daily-supply-growth': async (input) => getDailySupplyGrowth(input),
  'statistics.daily-market-cap': async (input) => getDailyMarketCap(input),
  'statistics.daily-staked': async (input) => getDailyStaked(input),
  'statistics.daily-holder': async (input) => getDailyHolder(input),
  'statistics.daily-tvl': async (input) => getDailyTvl(input),
  'statistics.node-current-produce-info': async (input) => getNodeCurrentProduceInfo(input),
  'statistics.elf-supply': async (input) => getElfSupply(input),
  'statistics.daily-transaction-info': async (input) => getDailyTransactionInfo(input as any),
  'statistics.daily-activity-address': async (input) => getDailyActivityAddress(input as any),
  'statistics.currency-price': async (input) => getCurrencyPrice(input),
};

function parseInput(raw?: string): Record<string, unknown> {
  if (!raw) {
    return {};
  }

  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      throw new Error('Input must be a JSON object.');
    }

    return parsed as Record<string, unknown>;
  } catch (error) {
    throw new Error(`Invalid --input JSON: ${(error as Error).message}`);
  }
}

async function runCommand(domain: string, action: string, inputRaw?: string): Promise<void> {
  const key = `${domain}.${action}`;
  const handler = handlers[key];

  if (!handler) {
    throw new Error(`Unsupported command: ${key}`);
  }

  const input = parseInput(inputRaw);
  const result = await handler(input);
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);

  if (!result.success) {
    process.exitCode = 1;
  }
}

const program = new Command();
program
  .name('aelfscan-skill')
  .description('AelfScan skill CLI (search/blockchain/address/token/nft/statistics)')
  .argument('<domain>', 'search | blockchain | address | token | nft | statistics')
  .argument('<action>', 'action name under domain')
  .option('--input <json>', 'JSON input payload')
  .action(async (domain, action, options: { input?: string }) => {
    await runCommand(domain, action, options.input);
  });

program.parseAsync(process.argv).catch((error: unknown) => {
  process.stderr.write(`[ERROR] ${(error as Error).message}\n`);
  process.exit(1);
});
