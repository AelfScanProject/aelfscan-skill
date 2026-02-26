import { request } from '../../lib/http-client.js';
import { requireField } from '../../lib/errors.js';
import type {
  AccountsInput,
  AddressDetailInput,
  AddressNftAssetsInput,
  AddressTokensInput,
  AddressTransfersInput,
  ContractEventsInput,
  ContractHistoryInput,
  ContractsInput,
  ContractSourceInput,
  ToolResult,
} from '../../lib/types.js';
import { executeTool, resolveAddress, resolveChainId, toPaginationQuery } from './common.js';

export async function getAccounts(input: AccountsInput = {}): Promise<ToolResult<unknown>> {
  return executeTool(async () => {
    return request<unknown>({
      path: '/api/app/address/accounts',
      query: {
        chainId: resolveChainId(input.chainId),
        ...toPaginationQuery(input),
      },
    });
  }, 'GET_ACCOUNTS_FAILED');
}

export async function getContracts(input: ContractsInput = {}): Promise<ToolResult<unknown>> {
  return executeTool(async () => {
    return request<unknown>({
      path: '/api/app/address/contracts',
      query: {
        chainId: resolveChainId(input.chainId),
        ...toPaginationQuery(input),
      },
    });
  }, 'GET_CONTRACTS_FAILED');
}

export async function getAddressDetail(input: AddressDetailInput): Promise<ToolResult<unknown>> {
  return executeTool(async () => {
    requireField(input.address, 'address');

    return request<unknown>({
      path: '/api/app/address/detail',
      query: {
        chainId: resolveChainId(input.chainId),
        address: resolveAddress(input.address),
      },
    });
  }, 'GET_ADDRESS_DETAIL_FAILED');
}

export async function getAddressTokens(input: AddressTokensInput): Promise<ToolResult<unknown>> {
  return executeTool(async () => {
    requireField(input.address, 'address');

    return request<unknown>({
      path: '/api/app/address/tokens',
      query: {
        chainId: resolveChainId(input.chainId),
        address: resolveAddress(input.address),
        fuzzySearch: input.fuzzySearch,
        ...toPaginationQuery(input),
      },
    });
  }, 'GET_ADDRESS_TOKENS_FAILED');
}

export async function getAddressNftAssets(input: AddressNftAssetsInput): Promise<ToolResult<unknown>> {
  return executeTool(async () => {
    requireField(input.address, 'address');

    return request<unknown>({
      path: '/api/app/address/nft-assets',
      query: {
        chainId: resolveChainId(input.chainId),
        address: resolveAddress(input.address),
        fuzzySearch: input.fuzzySearch,
        ...toPaginationQuery(input),
      },
    });
  }, 'GET_ADDRESS_NFT_ASSETS_FAILED');
}

export async function getAddressTransfers(input: AddressTransfersInput): Promise<ToolResult<unknown>> {
  return executeTool(async () => {
    requireField(input.address, 'address');

    return request<unknown>({
      path: '/api/app/address/transfers',
      query: {
        chainId: resolveChainId(input.chainId),
        address: resolveAddress(input.address),
        symbol: input.symbol,
        tokenType: input.tokenType,
        ...toPaginationQuery(input),
      },
    });
  }, 'GET_ADDRESS_TRANSFERS_FAILED');
}

export async function getContractHistory(input: ContractHistoryInput): Promise<ToolResult<unknown>> {
  return executeTool(async () => {
    requireField(input.address, 'address');

    return request<unknown>({
      path: '/api/app/address/contract/history',
      query: {
        chainId: resolveChainId(input.chainId),
        address: resolveAddress(input.address),
      },
    });
  }, 'GET_CONTRACT_HISTORY_FAILED');
}

export async function getContractEvents(input: ContractEventsInput): Promise<ToolResult<unknown>> {
  return executeTool(async () => {
    requireField(input.contractAddress, 'contractAddress');

    return request<unknown>({
      path: '/api/app/address/contract/events',
      query: {
        chainId: resolveChainId(input.chainId),
        contractAddress: resolveAddress(input.contractAddress),
        blockHeight: input.blockHeight,
        ...toPaginationQuery(input),
      },
    });
  }, 'GET_CONTRACT_EVENTS_FAILED');
}

export async function getContractSource(input: ContractSourceInput): Promise<ToolResult<unknown>> {
  return executeTool(async () => {
    requireField(input.address, 'address');

    return request<unknown>({
      path: '/api/app/address/contract/file',
      query: {
        chainId: resolveChainId(input.chainId),
        address: resolveAddress(input.address),
      },
    });
  }, 'GET_CONTRACT_SOURCE_FAILED');
}
