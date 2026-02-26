import { normalizeChainId } from './normalize.js';
import type { AelfscanConfig } from './types.js';

const DEFAULT_TIMEOUT_MS = 10_000;
const DEFAULT_RETRY = 1;
const DEFAULT_API_BASE_URL = 'https://aelfscan.io';

let cachedConfig: AelfscanConfig | null = null;

function toNumber(raw: string | undefined, fallback: number): number {
  if (!raw) {
    return fallback;
  }

  const value = Number(raw);
  return Number.isFinite(value) && value >= 0 ? value : fallback;
}

function trimSlash(input: string): string {
  return input.replace(/\/+$/, '');
}

export function getConfig(): AelfscanConfig {
  if (cachedConfig) {
    return cachedConfig;
  }

  cachedConfig = {
    apiBaseUrl: trimSlash(process.env.AELFSCAN_API_BASE_URL || DEFAULT_API_BASE_URL),
    defaultChainId: normalizeChainId(process.env.AELFSCAN_DEFAULT_CHAIN_ID || ''),
    timeoutMs: toNumber(process.env.AELFSCAN_TIMEOUT_MS, DEFAULT_TIMEOUT_MS),
    retry: Math.floor(toNumber(process.env.AELFSCAN_RETRY, DEFAULT_RETRY)),
  };

  return cachedConfig;
}

export function resetConfigCache(): void {
  cachedConfig = null;
}
