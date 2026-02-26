import { request } from '../../lib/http-client.js';
import { requireField } from '../../lib/errors.js';
import type {
  NftCollectionDetailInput,
  NftCollectionsInput,
  NftHoldersInput,
  NftInventoryInput,
  NftItemActivityInput,
  NftItemDetailInput,
  NftItemHoldersInput,
  NftTransfersInput,
  ToolResult,
} from '../../lib/types.js';
import { executeTool, resolveAddress, resolveChainId, toPaginationQuery } from './common.js';

export async function getNftCollections(input: NftCollectionsInput = {}): Promise<ToolResult<unknown>> {
  return executeTool(async () => {
    return request<unknown>({
      path: '/api/app/token/nft/collection-list',
      query: {
        chainId: resolveChainId(input.chainId),
        ...toPaginationQuery(input),
        types: input.types,
        symbols: input.symbols,
        collectionSymbols: input.collectionSymbols,
        search: input.search,
        exactSearch: input.exactSearch,
        fuzzySearch: input.fuzzySearch,
        beginBlockTime: input.beginBlockTime,
      },
    });
  }, 'GET_NFT_COLLECTIONS_FAILED');
}

export async function getNftCollectionDetail(input: NftCollectionDetailInput): Promise<ToolResult<unknown>> {
  return executeTool(async () => {
    requireField(input.collectionSymbol, 'collectionSymbol');

    return request<unknown>({
      path: '/api/app/token/nft/collection-detail',
      query: {
        chainId: resolveChainId(input.chainId),
        collectionSymbol: input.collectionSymbol,
      },
    });
  }, 'GET_NFT_COLLECTION_DETAIL_FAILED');
}

export async function getNftTransfers(input: NftTransfersInput): Promise<ToolResult<unknown>> {
  return executeTool(async () => {
    requireField(input.collectionSymbol, 'collectionSymbol');

    return request<unknown>({
      path: '/api/app/token/nft/transfers',
      query: {
        chainId: resolveChainId(input.chainId),
        collectionSymbol: input.collectionSymbol,
        search: resolveAddress(input.search),
        address: resolveAddress(input.address),
        ...toPaginationQuery(input),
      },
    });
  }, 'GET_NFT_TRANSFERS_FAILED');
}

export async function getNftHolders(input: NftHoldersInput): Promise<ToolResult<unknown>> {
  return executeTool(async () => {
    requireField(input.collectionSymbol, 'collectionSymbol');

    return request<unknown>({
      path: '/api/app/token/nft/holders',
      query: {
        chainId: resolveChainId(input.chainId),
        collectionSymbol: input.collectionSymbol,
        search: resolveAddress(input.search),
        ...toPaginationQuery(input),
      },
    });
  }, 'GET_NFT_HOLDERS_FAILED');
}

export async function getNftInventory(input: NftInventoryInput): Promise<ToolResult<unknown>> {
  return executeTool(async () => {
    requireField(input.collectionSymbol, 'collectionSymbol');

    return request<unknown>({
      path: '/api/app/token/nft/inventory',
      query: {
        chainId: resolveChainId(input.chainId),
        collectionSymbol: input.collectionSymbol,
        search: resolveAddress(input.search),
        ...toPaginationQuery(input),
      },
    });
  }, 'GET_NFT_INVENTORY_FAILED');
}

export async function getNftItemDetail(input: NftItemDetailInput): Promise<ToolResult<unknown>> {
  return executeTool(async () => {
    requireField(input.symbol, 'symbol');

    return request<unknown>({
      path: '/api/app/token/nft/item-detail',
      query: {
        chainId: resolveChainId(input.chainId),
        symbol: input.symbol,
      },
    });
  }, 'GET_NFT_ITEM_DETAIL_FAILED');
}

export async function getNftItemHolders(input: NftItemHoldersInput): Promise<ToolResult<unknown>> {
  return executeTool(async () => {
    requireField(input.symbol, 'symbol');

    return request<unknown>({
      path: '/api/app/token/nft/item-holders',
      query: {
        chainId: resolveChainId(input.chainId),
        symbol: input.symbol,
        types: input.types,
        ...toPaginationQuery(input),
      },
    });
  }, 'GET_NFT_ITEM_HOLDERS_FAILED');
}

export async function getNftItemActivity(input: NftItemActivityInput): Promise<ToolResult<unknown>> {
  return executeTool(async () => {
    requireField(input.symbol, 'symbol');

    return request<unknown>({
      path: '/api/app/token/nft/item-activity',
      query: {
        chainId: resolveChainId(input.chainId),
        symbol: input.symbol,
        ...toPaginationQuery(input),
      },
    });
  }, 'GET_NFT_ITEM_ACTIVITY_FAILED');
}
