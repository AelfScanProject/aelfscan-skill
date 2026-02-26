import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import { getConfig, resetConfigCache } from '../../lib/config.js';

const ENV_KEYS = [
  'AELFSCAN_API_BASE_URL',
  'AELFSCAN_DEFAULT_CHAIN_ID',
  'AELFSCAN_TIMEOUT_MS',
  'AELFSCAN_RETRY',
] as const;

type EnvSnapshot = Record<(typeof ENV_KEYS)[number], string | undefined>;

let snapshot: EnvSnapshot;

function restoreEnv(from: EnvSnapshot): void {
  ENV_KEYS.forEach((key) => {
    const value = from[key];
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  });
}

beforeEach(() => {
  snapshot = {
    AELFSCAN_API_BASE_URL: process.env.AELFSCAN_API_BASE_URL,
    AELFSCAN_DEFAULT_CHAIN_ID: process.env.AELFSCAN_DEFAULT_CHAIN_ID,
    AELFSCAN_TIMEOUT_MS: process.env.AELFSCAN_TIMEOUT_MS,
    AELFSCAN_RETRY: process.env.AELFSCAN_RETRY,
  };
  resetConfigCache();
});

afterEach(() => {
  restoreEnv(snapshot);
  resetConfigCache();
});

describe('config', () => {
  test('parses env values and normalizes outputs', () => {
    process.env.AELFSCAN_API_BASE_URL = 'https://example.com///';
    process.env.AELFSCAN_DEFAULT_CHAIN_ID = ' multiChain ';
    process.env.AELFSCAN_TIMEOUT_MS = '1234';
    process.env.AELFSCAN_RETRY = '2.9';

    const config = getConfig();

    expect(config.apiBaseUrl).toBe('https://example.com');
    expect(config.defaultChainId).toBe('');
    expect(config.timeoutMs).toBe(1234);
    expect(config.retry).toBe(2);
  });

  test('falls back on invalid numeric env values', () => {
    process.env.AELFSCAN_TIMEOUT_MS = 'abc';
    process.env.AELFSCAN_RETRY = '-1';

    const config = getConfig();

    expect(config.timeoutMs).toBe(10000);
    expect(config.retry).toBe(1);
  });

  test('caches config until reset', () => {
    process.env.AELFSCAN_API_BASE_URL = 'https://cache-1.example.com';
    const first = getConfig();

    process.env.AELFSCAN_API_BASE_URL = 'https://cache-2.example.com';
    const second = getConfig();

    expect(second).toBe(first);
    expect(second.apiBaseUrl).toBe('https://cache-1.example.com');

    resetConfigCache();
    const third = getConfig();
    expect(third.apiBaseUrl).toBe('https://cache-2.example.com');
  });
});
