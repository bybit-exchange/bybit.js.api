import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponseHeaders,
  type RawAxiosResponseHeaders,
} from 'axios'
import { signV5 } from './sign.js'
import {
  BybitRateLimitError,
  classifyRetCode,
  headerValue,
  translateAxiosError,
  type BybitErrorContext,
} from './errors.js'
import type { ApiResponse } from '../types/common.js'
import {
  type RestClientOptions,
  BASE_URL_MAINNET,
  BASE_URL_TESTNET,
  DEFAULT_RECV_WINDOW,
  DEFAULT_TIMEOUT_MS,
} from '../config.js'

export interface RequestSpec {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  path: string
  signed: boolean
  query?: Record<string, unknown>
  body?: Record<string, unknown>
}

export interface RateLimitInfo {
  limit?:     string
  remaining?: string
  resetAt?:   string
}

export function createHttp(options: RestClientOptions): AxiosInstance {
  if (options.axiosInstance) {
    if (options.baseUrl || options.testnet !== undefined || options.timeout !== undefined) {
      throw new Error(
        'RestClientOptions: axiosInstance is mutually exclusive with baseUrl/testnet/timeout — ' +
          'configure them on your axios instance instead.',
      )
    }
    return options.axiosInstance
  }
  const baseURL = options.baseUrl || (options.testnet ? BASE_URL_TESTNET : BASE_URL_MAINNET)
  return axios.create({
    baseURL,
    timeout: options.timeout ?? DEFAULT_TIMEOUT_MS,
  })
}

function isNotNull(v: unknown): boolean {
  return v !== undefined && v !== null
}

function serializeQuery(params: Record<string, unknown> | undefined): string {
  if (!params) return ''
  const entries: [string, string][] = []
  for (const [k, v] of Object.entries(params)) {
    if (!isNotNull(v)) continue
    entries.push([k, typeof v === 'object' ? JSON.stringify(v) : String(v)])
  }
  entries.sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
  return new URLSearchParams(entries).toString()
}

function stripEmpty<T extends Record<string, unknown>>(o: T): T {
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(o)) {
    if (isNotNull(v)) out[k] = v
  }
  return out as T
}

// Bybit's P2P endpoints (and a handful of other legacy routes) return the pre-V5
// envelope shape: { ret_code, ret_msg, ext_code, ext_info, time_now, result }.
// Normalize to the V5 shape so downstream code sees a uniform ApiResponse.
function normalizeEnvelope<T>(body: unknown): unknown {
  if (!body || typeof body !== 'object') return body
  const b = body as Record<string, unknown>
  if ('retCode' in b) return body
  if ('ret_code' in b) {
    return {
      retCode:    b.ret_code as number,
      retMsg:     (b.ret_msg  as string) ?? '',
      result:     (b.result   as T)      ?? {},
      retExtInfo: {
        ...(typeof b.ext_info === 'object' && b.ext_info !== null ? (b.ext_info as Record<string, unknown>) : {}),
        ...(b.ext_code !== undefined ? { extCode: b.ext_code } : {}),
      },
      time:       typeof b.time_now === 'string' ? Math.round(parseFloat(b.time_now) * 1000) : Date.now(),
    }
  }
  return body
}

// Instance-local symbol — avoids collisions across module realms without polluting the global registry.
const RATE_LIMIT_KEY = Symbol('bybit.rateLimit')

export function getRateLimit(response: unknown): RateLimitInfo | undefined {
  if (!response || typeof response !== 'object') return undefined
  return (response as Record<symbol, RateLimitInfo | undefined>)[RATE_LIMIT_KEY]
}

function readRateLimit(
  headers: AxiosResponseHeaders | RawAxiosResponseHeaders | undefined,
): RateLimitInfo | undefined {
  if (!headers) return undefined
  const info: RateLimitInfo = {
    limit:     headerValue(headers, 'x-bapi-limit'),
    remaining: headerValue(headers, 'x-bapi-limit-status'),
    resetAt:   headerValue(headers, 'x-bapi-limit-reset-timestamp'),
  }
  if (info.limit === undefined && info.remaining === undefined && info.resetAt === undefined) return undefined
  return info
}

export async function requestJson<T = unknown>(
  http:    AxiosInstance,
  options: RestClientOptions,
  spec:    RequestSpec,
): Promise<ApiResponse<T>> {
  const timestamp  = Date.now().toString()
  const recvWindow = options.recvWindow ?? DEFAULT_RECV_WINDOW
  const cleanQuery = spec.query ? stripEmpty(spec.query) : undefined
  const cleanBody  = spec.body  ? stripEmpty(spec.body)  : undefined
  const queryString = serializeQuery(cleanQuery)
  const bodyString  = cleanBody ? JSON.stringify(cleanBody) : ''

  const context: BybitErrorContext = {
    method: spec.method,
    path:   spec.path,
    timestamp,
    recvWindow,
  }

  const headers: Record<string, string> = {}
  const config: AxiosRequestConfig = {
    method: spec.method,
    url: spec.path + (queryString ? '?' + queryString : ''),
    headers,
  }
  if (cleanBody) {
    // Send the exact bytes we signed so custom axios request transforms cannot desync payload vs signature.
    config.data = bodyString
    headers['Content-Type'] = 'application/json'
  }

  if (spec.signed) {
    if (!options.apiKey || !options.apiSecret) {
      throw new Error('Signed endpoint requires apiKey + apiSecret in RestClientOptions')
    }
    const payload = spec.method === 'GET' ? queryString : bodyString
    const signature = signV5(options.apiSecret, timestamp, options.apiKey, recvWindow, payload)
    Object.assign(headers, {
      'X-BAPI-API-KEY':     options.apiKey,
      'X-BAPI-TIMESTAMP':   timestamp,
      'X-BAPI-RECV-WINDOW': recvWindow,
      'X-BAPI-SIGN':        signature,
      'X-BAPI-SIGN-TYPE':   '2',
    })
  }

  let response
  try {
    response = await http.request<ApiResponse<T>>(config)
  } catch (err) {
    throw translateAxiosError(err, context)
  }

  const body = normalizeEnvelope(response.data)
  const rateLimit = readRateLimit(response.headers)

  // Defensive: a user-provided axios instance can be configured to accept non-2xx as success (validateStatus).
  if (response.status === 429) {
    throw new BybitRateLimitError('Rate limit exceeded', response.status, response.headers, context)
  }

  if (!body || typeof body !== 'object' || !('retCode' in body)) {
    throw translateAxiosError(
      Object.assign(new Error('Unexpected response body'), { isAxiosError: true, response }),
      context,
    )
  }

  if (body.retCode !== 0) {
    throw classifyRetCode(body as ApiResponse<unknown>, context, response.headers)
  }

  if (rateLimit) {
    Object.defineProperty(body, RATE_LIMIT_KEY, {
      value:        rateLimit,
      enumerable:   false,
      configurable: true,  // allow the same body object to be re-decorated on retry
      writable:     true,
    })
  }
  return body as ApiResponse<T>
}
