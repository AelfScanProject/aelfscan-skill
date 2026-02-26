import { fail, ok } from '../../lib/errors.js';
import { getConfig } from '../../lib/config.js';
import { normalizeAddress, normalizeChainId } from '../../lib/normalize.js';
import { createTraceId } from '../../lib/trace.js';
import type { PaginationInput, ToolResult } from '../../lib/types.js';

export type ActionResult<T> = {
  data: T;
  raw?: unknown;
};

export async function executeTool<T>(
  action: (traceId: string) => Promise<ActionResult<T>>,
  fallbackCode: string,
): Promise<ToolResult<T>> {
  const traceId = createTraceId();

  try {
    const result = await action(traceId);
    return ok(traceId, result.data, result.raw);
  } catch (error) {
    return fail(traceId, error, fallbackCode);
  }
}

export function resolveChainId(chainId?: string): string {
  const config = getConfig();
  return normalizeChainId(chainId ?? config.defaultChainId);
}

export function resolveAddress(address?: string): string {
  return normalizeAddress(address);
}

export function toPaginationQuery(input: PaginationInput): Record<string, unknown> {
  return {
    skipCount: input.skipCount,
    maxResultCount: input.maxResultCount,
    orderBy: input.orderBy,
    sort: input.sort,
    orderInfos: input.orderInfos,
    searchAfter: input.searchAfter,
  };
}
