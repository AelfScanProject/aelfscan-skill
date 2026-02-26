import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import { resetConfigCache } from '../../lib/config.js';
import { request } from '../../lib/http-client.js';

const originalFetch = globalThis.fetch;
const ENV_KEYS = ['AELFSCAN_TIMEOUT_MS', 'AELFSCAN_RETRY'] as const;

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
    AELFSCAN_TIMEOUT_MS: process.env.AELFSCAN_TIMEOUT_MS,
    AELFSCAN_RETRY: process.env.AELFSCAN_RETRY,
  };
  resetConfigCache();
});

afterEach(() => {
  globalThis.fetch = originalFetch;
  restoreEnv(snapshot);
  resetConfigCache();
});

describe('http client edge cases', () => {
  test('supports non-envelope JSON response and auto-leading slash path', async () => {
    let requestUrl = '';

    globalThis.fetch = (async (input: RequestInfo | URL) => {
      requestUrl = String(input);
      return new Response(JSON.stringify({ hello: 'world' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }) as unknown as typeof fetch;

    const result = await request<{ hello: string }>({
      path: 'api/custom',
      query: { chainId: 'AELF' },
    });

    expect(requestUrl.includes('/api/custom')).toBe(true);
    expect(requestUrl.includes('chainId=AELF')).toBe(true);
    expect(result.data.hello).toBe('world');
    expect((result.raw as { hello: string }).hello).toBe('world');
  });

  test('returns null for empty 200 response body', async () => {
    globalThis.fetch = (async () => {
      return new Response('', { status: 200 });
    }) as unknown as typeof fetch;

    const result = await request<null>({ path: '/api/empty' });

    expect(result.data).toBeNull();
    expect(result.raw).toBeNull();
  });

  test('retries when fetch throws non-skill error', async () => {
    process.env.AELFSCAN_RETRY = '1';
    process.env.AELFSCAN_TIMEOUT_MS = '1000';
    resetConfigCache();

    let callCount = 0;

    globalThis.fetch = (async () => {
      callCount += 1;
      if (callCount === 1) {
        throw new Error('transient network failure');
      }

      return new Response(
        JSON.stringify({
          code: '20000',
          data: { ok: true },
          message: '',
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      );
    }) as unknown as typeof fetch;

    const result = await request<{ ok: boolean }>({ path: '/api/retry' });

    expect(callCount).toBe(2);
    expect(result.data.ok).toBe(true);
  });

  test('returns plain text response when body is not JSON', async () => {
    globalThis.fetch = (async () => {
      return new Response('pong', { status: 200, headers: { 'Content-Type': 'text/plain' } });
    }) as unknown as typeof fetch;

    const result = await request<string>({ path: '/api/text' });

    expect(result.data).toBe('pong');
    expect(result.raw).toBe('pong');
  });

  test('does not retry for 4xx http errors', async () => {
    process.env.AELFSCAN_RETRY = '1';
    process.env.AELFSCAN_TIMEOUT_MS = '1000';
    resetConfigCache();

    let callCount = 0;
    globalThis.fetch = (async () => {
      callCount += 1;
      return new Response('bad request', { status: 400 });
    }) as unknown as typeof fetch;

    await expect(
      request({
        path: '/api/no-retry',
      }),
    ).rejects.toThrow('HTTP request failed with status 400');

    expect(callCount).toBe(1);
  });

  test('retries for 5xx http errors', async () => {
    process.env.AELFSCAN_RETRY = '1';
    process.env.AELFSCAN_TIMEOUT_MS = '1000';
    resetConfigCache();

    let callCount = 0;
    globalThis.fetch = (async () => {
      callCount += 1;
      if (callCount === 1) {
        return new Response('server error', { status: 500 });
      }

      return new Response(
        JSON.stringify({
          code: '20000',
          data: { ok: true },
          message: '',
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      );
    }) as unknown as typeof fetch;

    const result = await request<{ ok: boolean }>({
      path: '/api/retry-5xx',
    });

    expect(callCount).toBe(2);
    expect(result.data.ok).toBe(true);
  });
});
