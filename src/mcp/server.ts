#!/usr/bin/env bun
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
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
  getContractEvents,
  getContractHistory,
  getContracts,
  getContractSource,
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
  getNodeBlockProduce,
  getNodeCurrentProduceInfo,
  getSearchFilters,
  getTopContractCall,
  getTokenDetail,
  getTokenHolders,
  getTokens,
  getTokenTransfers,
  getTransactionDataChart,
  getTransactionDetail,
  getTransactions,
  getUniqueAddresses,
  search,
} from '../../index.js';

const server = new McpServer({
  name: 'aelfscan-skill',
  version: '0.1.0',
});

function asMcpResult(data: unknown) {
  return {
    content: [
      {
        type: 'text' as const,
        text: JSON.stringify(data, null, 2),
      },
    ],
  };
}

const sortDirectionSchema = z.enum(['Asc', 'Desc']);

const orderInfoSchema = z.object({
  orderBy: z.string().describe('Sort field name, e.g. BlockTime'),
  sort: sortDirectionSchema.describe('Sort direction Asc or Desc'),
});

const paginationSchema = {
  chainId: z.string().optional().describe('Chain id, e.g. AELF/tDVV; empty for multi-chain'),
  skipCount: z.number().int().optional().describe('Offset for pagination'),
  maxResultCount: z.number().int().optional().describe('Page size'),
  orderBy: z.string().optional().describe('Simple sort field'),
  sort: sortDirectionSchema.optional().describe('Simple sort direction'),
  orderInfos: z.array(orderInfoSchema).optional().describe('Advanced sorting list'),
  searchAfter: z.array(z.string()).optional().describe('search_after cursor values'),
};

const statisticsSchema = {
  chainId: z.string().optional().describe('Chain id, e.g. AELF/tDVV; empty for multi-chain'),
  startDate: z.string().optional().describe('Start date (YYYY-MM-DD)'),
  endDate: z.string().optional().describe('End date (YYYY-MM-DD)'),
};

server.registerTool(
  'aelfscan_search_filters',
  {
    description: 'Get search filter metadata used by explorer search UI.',
    inputSchema: {
      chainId: z.string().optional(),
    },
  },
  async input => asMcpResult(await getSearchFilters(input)),
);

server.registerTool(
  'aelfscan_search',
  {
    description: 'Search tokens/accounts/contracts/NFTs/blocks/transactions on AelfScan explorer.',
    inputSchema: {
      chainId: z.string().optional(),
      keyword: z.string().describe('Search keyword'),
      filterType: z.number().int().optional().describe('0:all,1:tokens,2:accounts,3:contracts,4:nfts'),
      searchType: z.number().int().optional().describe('0:fuzzy,1:exact'),
    },
  },
  async input => asMcpResult(await search(input)),
);

server.registerTool(
  'aelfscan_blocks',
  {
    description: 'List blocks with pagination.',
    inputSchema: {
      ...paginationSchema,
      isLastPage: z.boolean().optional(),
    },
  },
  async input => asMcpResult(await getBlocks(input)),
);

server.registerTool(
  'aelfscan_blocks_latest',
  {
    description: 'Get latest blocks (uses blocks API with skipCount=0).',
    inputSchema: {
      chainId: z.string().optional(),
      maxResultCount: z.number().int().optional(),
      orderBy: z.string().optional(),
      sort: sortDirectionSchema.optional(),
      orderInfos: z.array(orderInfoSchema).optional(),
      searchAfter: z.array(z.string()).optional(),
      isLastPage: z.boolean().optional(),
    },
  },
  async input => asMcpResult(await getLatestBlocks(input)),
);

server.registerTool(
  'aelfscan_block_detail',
  {
    description: 'Get block detail by block height.',
    inputSchema: {
      chainId: z.string().optional(),
      blockHeight: z.number().int().describe('Block height'),
    },
  },
  async input => asMcpResult(await getBlockDetail(input)),
);

server.registerTool(
  'aelfscan_transactions',
  {
    description: 'List transactions with optional filters.',
    inputSchema: {
      ...paginationSchema,
      transactionId: z.string().optional(),
      blockHeight: z.number().int().optional(),
      address: z.string().optional(),
      startTime: z.number().int().optional(),
      endTime: z.number().int().optional(),
    },
  },
  async input => asMcpResult(await getTransactions(input)),
);

server.registerTool(
  'aelfscan_transactions_latest',
  {
    description: 'Get latest transactions (uses transactions API with skipCount=0).',
    inputSchema: {
      chainId: z.string().optional(),
      maxResultCount: z.number().int().optional(),
      orderBy: z.string().optional(),
      sort: sortDirectionSchema.optional(),
      orderInfos: z.array(orderInfoSchema).optional(),
      searchAfter: z.array(z.string()).optional(),
      transactionId: z.string().optional(),
      blockHeight: z.number().int().optional(),
      address: z.string().optional(),
      startTime: z.number().int().optional(),
      endTime: z.number().int().optional(),
    },
  },
  async input => asMcpResult(await getLatestTransactions(input)),
);

server.registerTool(
  'aelfscan_transaction_detail',
  {
    description: 'Get transaction detail by transaction id.',
    inputSchema: {
      chainId: z.string().optional(),
      transactionId: z.string().describe('Transaction id'),
      blockHeight: z.number().int().optional(),
    },
  },
  async input => asMcpResult(await getTransactionDetail(input)),
);

server.registerTool(
  'aelfscan_blockchain_overview',
  {
    description: 'Get blockchain overview metrics and aggregate stats.',
    inputSchema: {
      chainId: z.string().optional(),
    },
  },
  async input => asMcpResult(await getBlockchainOverview(input)),
);

server.registerTool(
  'aelfscan_transaction_data_chart',
  {
    description: 'Get transaction data chart series.',
    inputSchema: {
      chainId: z.string().optional(),
    },
  },
  async input => asMcpResult(await getTransactionDataChart(input)),
);

server.registerTool(
  'aelfscan_address_dictionary',
  {
    description: 'Resolve or query address dictionary metadata.',
    inputSchema: {
      chainId: z.string().optional(),
      name: z.string().describe('Dictionary name'),
      addresses: z.array(z.string()).min(1).describe('Address list'),
    },
  },
  async input => asMcpResult(await getAddressDictionary(input)),
);

server.registerTool(
  'aelfscan_log_events',
  {
    description: 'Get contract log events by contract address.',
    inputSchema: {
      ...paginationSchema,
      contractAddress: z.string().describe('Contract address'),
      address: z.string().optional(),
      eventName: z.string().optional(),
      transactionId: z.string().optional(),
      blockHeight: z.number().int().optional(),
      startBlockHeight: z.number().int().optional(),
      endBlockHeight: z.number().int().optional(),
    },
  },
  async input => asMcpResult(await getLogEvents(input)),
);

server.registerTool(
  'aelfscan_accounts',
  {
    description: 'List top accounts.',
    inputSchema: {
      ...paginationSchema,
    },
  },
  async input => asMcpResult(await getAccounts(input)),
);

server.registerTool(
  'aelfscan_contracts',
  {
    description: 'List contracts.',
    inputSchema: {
      ...paginationSchema,
    },
  },
  async input => asMcpResult(await getContracts(input)),
);

server.registerTool(
  'aelfscan_address_detail',
  {
    description: 'Get address detail (EOA/contract profile and portfolio).',
    inputSchema: {
      chainId: z.string().optional(),
      address: z.string().describe('Address, supports ELF_xxx_chain format'),
    },
  },
  async input => asMcpResult(await getAddressDetail(input)),
);

server.registerTool(
  'aelfscan_address_tokens',
  {
    description: 'Get token holdings for an address.',
    inputSchema: {
      ...paginationSchema,
      address: z.string().describe('Address'),
      fuzzySearch: z.string().optional(),
    },
  },
  async input => asMcpResult(await getAddressTokens(input)),
);

server.registerTool(
  'aelfscan_address_nft_assets',
  {
    description: 'Get NFT holdings for an address.',
    inputSchema: {
      ...paginationSchema,
      address: z.string().describe('Address'),
      fuzzySearch: z.string().optional(),
    },
  },
  async input => asMcpResult(await getAddressNftAssets(input)),
);

server.registerTool(
  'aelfscan_address_transfers',
  {
    description: 'Get transfer history for an address.',
    inputSchema: {
      ...paginationSchema,
      address: z.string().describe('Address'),
      symbol: z.string().optional(),
      tokenType: z.number().int().optional().describe('0:token,1:nft'),
    },
  },
  async input => asMcpResult(await getAddressTransfers(input)),
);

server.registerTool(
  'aelfscan_contract_history',
  {
    description: 'Get contract deploy/update history.',
    inputSchema: {
      chainId: z.string().optional(),
      address: z.string().describe('Contract address'),
    },
  },
  async input => asMcpResult(await getContractHistory(input)),
);

server.registerTool(
  'aelfscan_contract_events',
  {
    description: 'Get contract events list.',
    inputSchema: {
      ...paginationSchema,
      chainId: z.string().optional(),
      contractAddress: z.string().describe('Contract address'),
      blockHeight: z.number().int().optional(),
    },
  },
  async input => asMcpResult(await getContractEvents(input)),
);

server.registerTool(
  'aelfscan_contract_source',
  {
    description: 'Get verified contract source metadata.',
    inputSchema: {
      chainId: z.string().optional(),
      address: z.string().describe('Contract address'),
    },
  },
  async input => asMcpResult(await getContractSource(input)),
);

server.registerTool(
  'aelfscan_tokens',
  {
    description: 'List tokens.',
    inputSchema: {
      ...paginationSchema,
      types: z.array(z.number().int()).optional(),
      symbols: z.array(z.string()).optional(),
      collectionSymbols: z.array(z.string()).optional(),
      search: z.string().optional(),
      exactSearch: z.string().optional(),
      fuzzySearch: z.string().optional(),
      beginBlockTime: z.union([z.string(), z.number()]).optional(),
    },
  },
  async input => asMcpResult(await getTokens(input)),
);

server.registerTool(
  'aelfscan_token_detail',
  {
    description: 'Get token detail by symbol.',
    inputSchema: {
      chainId: z.string().optional(),
      symbol: z.string().describe('Token symbol'),
    },
  },
  async input => asMcpResult(await getTokenDetail(input)),
);

server.registerTool(
  'aelfscan_token_transfers',
  {
    description: 'Get token transfer list by symbol.',
    inputSchema: {
      ...paginationSchema,
      symbol: z.string().describe('Token symbol'),
      search: z.string().optional(),
      collectionSymbol: z.string().optional(),
      address: z.string().optional(),
      types: z.array(z.number().int()).optional(),
      fuzzySearch: z.string().optional(),
      beginBlockTime: z.union([z.string(), z.number()]).optional(),
    },
  },
  async input => asMcpResult(await getTokenTransfers(input)),
);

server.registerTool(
  'aelfscan_token_holders',
  {
    description: 'Get token holders.',
    inputSchema: {
      ...paginationSchema,
      symbol: z.string().optional(),
      collectionSymbol: z.string().optional(),
      address: z.string().optional(),
      partialSymbol: z.string().optional(),
      search: z.string().optional(),
      types: z.array(z.number().int()).optional(),
      symbols: z.array(z.string()).optional(),
      addressList: z.array(z.string()).optional(),
      searchSymbols: z.array(z.string()).optional(),
      fuzzySearch: z.string().optional(),
      amountGreaterThanZero: z.boolean().optional(),
    },
  },
  async input => asMcpResult(await getTokenHolders(input)),
);

server.registerTool(
  'aelfscan_nft_collections',
  {
    description: 'List NFT collections.',
    inputSchema: {
      ...paginationSchema,
      types: z.array(z.number().int()).optional(),
      symbols: z.array(z.string()).optional(),
      collectionSymbols: z.array(z.string()).optional(),
      search: z.string().optional(),
      exactSearch: z.string().optional(),
      fuzzySearch: z.string().optional(),
      beginBlockTime: z.union([z.string(), z.number()]).optional(),
    },
  },
  async input => asMcpResult(await getNftCollections(input)),
);

server.registerTool(
  'aelfscan_nft_collection_detail',
  {
    description: 'Get NFT collection detail.',
    inputSchema: {
      chainId: z.string().optional(),
      collectionSymbol: z.string().describe('NFT collection symbol'),
    },
  },
  async input => asMcpResult(await getNftCollectionDetail(input)),
);

server.registerTool(
  'aelfscan_nft_transfers',
  {
    description: 'Get NFT transfers by collection symbol.',
    inputSchema: {
      ...paginationSchema,
      chainId: z.string().optional(),
      collectionSymbol: z.string().describe('NFT collection symbol'),
      search: z.string().optional(),
      address: z.string().optional(),
    },
  },
  async input => asMcpResult(await getNftTransfers(input)),
);

server.registerTool(
  'aelfscan_nft_holders',
  {
    description: 'Get NFT holders by collection symbol.',
    inputSchema: {
      ...paginationSchema,
      chainId: z.string().optional(),
      collectionSymbol: z.string().describe('NFT collection symbol'),
      search: z.string().optional(),
    },
  },
  async input => asMcpResult(await getNftHolders(input)),
);

server.registerTool(
  'aelfscan_nft_inventory',
  {
    description: 'Get NFT inventory by collection symbol.',
    inputSchema: {
      ...paginationSchema,
      chainId: z.string().optional(),
      collectionSymbol: z.string().describe('NFT collection symbol'),
      search: z.string().optional(),
    },
  },
  async input => asMcpResult(await getNftInventory(input)),
);

server.registerTool(
  'aelfscan_nft_item_detail',
  {
    description: 'Get NFT item detail by symbol.',
    inputSchema: {
      chainId: z.string().optional(),
      symbol: z.string().describe('NFT item symbol'),
    },
  },
  async input => asMcpResult(await getNftItemDetail(input)),
);

server.registerTool(
  'aelfscan_nft_item_holders',
  {
    description: 'Get holders of a specific NFT item.',
    inputSchema: {
      ...paginationSchema,
      chainId: z.string().optional(),
      symbol: z.string().describe('NFT item symbol'),
      types: z.array(z.number().int()).optional(),
    },
  },
  async input => asMcpResult(await getNftItemHolders(input)),
);

server.registerTool(
  'aelfscan_nft_item_activity',
  {
    description: 'Get activity list of a specific NFT item.',
    inputSchema: {
      ...paginationSchema,
      chainId: z.string().optional(),
      symbol: z.string().describe('NFT item symbol'),
    },
  },
  async input => asMcpResult(await getNftItemActivity(input)),
);

server.registerTool(
  'aelfscan_statistics_daily_transactions',
  {
    description: 'Get daily transactions statistics.',
    inputSchema: {
      ...statisticsSchema,
    },
  },
  async input => asMcpResult(await getDailyTransactions(input)),
);

server.registerTool(
  'aelfscan_statistics_unique_addresses',
  {
    description: 'Get unique addresses statistics.',
    inputSchema: {
      ...statisticsSchema,
    },
  },
  async input => asMcpResult(await getUniqueAddresses(input)),
);

server.registerTool(
  'aelfscan_statistics_daily_active_addresses',
  {
    description: 'Get daily active addresses statistics.',
    inputSchema: {
      ...statisticsSchema,
    },
  },
  async input => asMcpResult(await getDailyActiveAddresses(input)),
);

server.registerTool(
  'aelfscan_statistics_monthly_active_addresses',
  {
    description: 'Get monthly active addresses statistics.',
    inputSchema: {
      ...statisticsSchema,
    },
  },
  async input => asMcpResult(await getMonthlyActiveAddresses(input)),
);

server.registerTool(
  'aelfscan_statistics_block_produce_rate',
  {
    description: 'Get block produce rate statistics.',
    inputSchema: {
      ...statisticsSchema,
    },
  },
  async input => asMcpResult(await getBlockProduceRate(input)),
);

server.registerTool(
  'aelfscan_statistics_avg_block_duration',
  {
    description: 'Get average block duration statistics.',
    inputSchema: {
      ...statisticsSchema,
    },
  },
  async input => asMcpResult(await getAvgBlockDuration(input)),
);

server.registerTool(
  'aelfscan_statistics_cycle_count',
  {
    description: 'Get cycle count statistics.',
    inputSchema: {
      ...statisticsSchema,
    },
  },
  async input => asMcpResult(await getCycleCount(input)),
);

server.registerTool(
  'aelfscan_statistics_node_block_produce',
  {
    description: 'Get node block produce statistics.',
    inputSchema: {
      ...statisticsSchema,
    },
  },
  async input => asMcpResult(await getNodeBlockProduce(input)),
);

server.registerTool(
  'aelfscan_statistics_daily_avg_transaction_fee',
  {
    description: 'Get daily average transaction fee statistics.',
    inputSchema: {
      ...statisticsSchema,
    },
  },
  async input => asMcpResult(await getDailyAvgTransactionFee(input)),
);

server.registerTool(
  'aelfscan_statistics_daily_tx_fee',
  {
    description: 'Get daily transaction fee statistics.',
    inputSchema: {
      ...statisticsSchema,
    },
  },
  async input => asMcpResult(await getDailyTxFee(input)),
);

server.registerTool(
  'aelfscan_statistics_daily_total_burnt',
  {
    description: 'Get daily total burnt statistics.',
    inputSchema: {
      ...statisticsSchema,
    },
  },
  async input => asMcpResult(await getDailyTotalBurnt(input)),
);

server.registerTool(
  'aelfscan_statistics_daily_elf_price',
  {
    description: 'Get daily ELF price statistics.',
    inputSchema: {
      ...statisticsSchema,
    },
  },
  async input => asMcpResult(await getDailyElfPrice(input)),
);

server.registerTool(
  'aelfscan_statistics_daily_deploy_contract',
  {
    description: 'Get daily deploy contract statistics.',
    inputSchema: {
      ...statisticsSchema,
    },
  },
  async input => asMcpResult(await getDailyDeployContract(input)),
);

server.registerTool(
  'aelfscan_statistics_daily_block_reward',
  {
    description: 'Get daily block reward statistics.',
    inputSchema: {
      ...statisticsSchema,
    },
  },
  async input => asMcpResult(await getDailyBlockReward(input)),
);

server.registerTool(
  'aelfscan_statistics_daily_avg_block_size',
  {
    description: 'Get daily average block size statistics.',
    inputSchema: {
      ...statisticsSchema,
    },
  },
  async input => asMcpResult(await getDailyAvgBlockSize(input)),
);

server.registerTool(
  'aelfscan_statistics_top_contract_call',
  {
    description: 'Get top contract call statistics.',
    inputSchema: {
      ...statisticsSchema,
    },
  },
  async input => asMcpResult(await getTopContractCall(input)),
);

server.registerTool(
  'aelfscan_statistics_daily_contract_call',
  {
    description: 'Get daily contract call statistics.',
    inputSchema: {
      ...statisticsSchema,
    },
  },
  async input => asMcpResult(await getDailyContractCall(input)),
);

server.registerTool(
  'aelfscan_statistics_daily_supply_growth',
  {
    description: 'Get daily supply growth statistics.',
    inputSchema: {
      ...statisticsSchema,
    },
  },
  async input => asMcpResult(await getDailySupplyGrowth(input)),
);

server.registerTool(
  'aelfscan_statistics_daily_market_cap',
  {
    description: 'Get daily market cap statistics.',
    inputSchema: {
      ...statisticsSchema,
    },
  },
  async input => asMcpResult(await getDailyMarketCap(input)),
);

server.registerTool(
  'aelfscan_statistics_daily_staked',
  {
    description: 'Get daily staked statistics.',
    inputSchema: {
      ...statisticsSchema,
    },
  },
  async input => asMcpResult(await getDailyStaked(input)),
);

server.registerTool(
  'aelfscan_statistics_daily_holder',
  {
    description: 'Get daily holder statistics.',
    inputSchema: {
      ...statisticsSchema,
    },
  },
  async input => asMcpResult(await getDailyHolder(input)),
);

server.registerTool(
  'aelfscan_statistics_daily_tvl',
  {
    description: 'Get daily TVL statistics.',
    inputSchema: {
      ...statisticsSchema,
    },
  },
  async input => asMcpResult(await getDailyTvl(input)),
);

server.registerTool(
  'aelfscan_statistics_node_current_produce_info',
  {
    description: 'Get current node produce information.',
    inputSchema: {
      ...statisticsSchema,
    },
  },
  async input => asMcpResult(await getNodeCurrentProduceInfo(input)),
);

server.registerTool(
  'aelfscan_statistics_elf_supply',
  {
    description: 'Get ELF supply statistics.',
    inputSchema: {
      ...statisticsSchema,
    },
  },
  async input => asMcpResult(await getElfSupply(input)),
);

server.registerTool(
  'aelfscan_statistics_daily_transaction_info',
  {
    description: 'Get daily transaction summary for a date range.',
    inputSchema: {
      chainId: z.string().optional(),
      startDate: z.string().describe('Start date (YYYY-MM-DD)'),
      endDate: z.string().describe('End date (YYYY-MM-DD)'),
    },
  },
  async input => asMcpResult(await getDailyTransactionInfo(input)),
);

server.registerTool(
  'aelfscan_statistics_daily_activity_address',
  {
    description: 'Get daily activity address summary for a date range.',
    inputSchema: {
      chainId: z.string().optional(),
      startDate: z.string().describe('Start date (YYYY-MM-DD)'),
      endDate: z.string().describe('End date (YYYY-MM-DD)'),
    },
  },
  async input => asMcpResult(await getDailyActivityAddress(input)),
);

server.registerTool(
  'aelfscan_statistics_currency_price',
  {
    description: 'Get currency price statistics.',
    inputSchema: {
      ...statisticsSchema,
    },
  },
  async input => asMcpResult(await getCurrencyPrice(input)),
);

const transport = new StdioServerTransport();
await server.connect(transport);
