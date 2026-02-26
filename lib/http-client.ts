import { getConfig } from './config.js';
import { SkillError, HttpStatusError } from './errors.js';
import { serializeQuery } from './serializer.js';
import type { AelfscanEnvelope, HttpClientResult } from './types.js';

export interface HttpRequestOptions {
  method?: 'GET' | 'POST';
  path: string;
  query?: Record<string, unknown>;
  body?: unknown;
  headers?: Record<string, string>;
}

function shouldRetry(error: unknown): boolean {
  if (!(error instanceof SkillError)) {
    return true;
  }

  if (!error.httpStatus) {
    return true;
  }

  return error.httpStatus >= 500;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function parseResponseBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function ensurePath(path: string): string {
  if (path.startsWith('/')) {
    return path;
  }

  return `/${path}`;
}

export async function request<T>(options: HttpRequestOptions): Promise<HttpClientResult<T>> {
  const config = getConfig();
  const method = options.method || 'GET';
  const path = ensurePath(options.path);
  const queryString = serializeQuery(options.query);
  const url = `${config.apiBaseUrl}${path}${queryString ? `?${queryString}` : ''}`;

  let lastError: unknown;

  for (let attempt = 0; attempt <= config.retry; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), config.timeoutMs);

    try {
      const response = await fetch(url, {
        method,
        signal: controller.signal,
        headers: {
          Accept: 'application/json, text/plain; q=0.9',
          'Content-Type': 'application/json',
          ...(options.headers || {}),
        },
        body: options.body === undefined ? undefined : JSON.stringify(options.body),
      });

      const rawBody = await parseResponseBody(response);

      if (!response.ok) {
        throw new HttpStatusError(response.status, rawBody);
      }

      const envelope = rawBody as AelfscanEnvelope<T>;
      if (envelope && typeof envelope === 'object' && 'code' in envelope) {
        if (envelope.code && envelope.code !== '20000') {
          throw new SkillError('API_BUSINESS_ERROR', envelope.message || 'Aelfscan business error', envelope);
        }

        return {
          data: (envelope.data as T) ?? ({} as T),
          raw: envelope,
        };
      }

      return {
        data: rawBody as T,
        raw: rawBody,
      };
    } catch (error) {
      lastError = error;
      if (attempt < config.retry && shouldRetry(error)) {
        await sleep(200 * (attempt + 1));
        continue;
      }
      break;
    } finally {
      clearTimeout(timeout);
    }
  }

  throw lastError;
}
