import type { AxiosError, AxiosResponseHeaders, RawAxiosResponseHeaders } from 'axios'
import type { ApiResponse } from '../types/common'

export interface BybitErrorContext {
  method: string
  path:   string
  timestamp?:  string
  recvWindow?: string
}

export abstract class BybitError extends Error {
  public readonly context?: BybitErrorContext

  protected constructor(message: string, context?: BybitErrorContext) {
    super(message)
    this.name = new.target.name
    this.context = context
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

export class BybitApiError extends BybitError {
  public readonly retCode: number
  public readonly retMsg:  string
  public readonly result:  unknown
  public readonly time:    number

  constructor(response: ApiResponse<unknown>, context?: BybitErrorContext) {
    super(`[${response.retCode}] ${response.retMsg}`, context)
    this.retCode = response.retCode
    this.retMsg  = response.retMsg
    this.result  = response.result
    this.time    = response.time
  }
}

export class BybitNetworkError extends BybitError {
  public readonly code?: string
  public readonly cause?: unknown

  constructor(message: string, code: string | undefined, context?: BybitErrorContext, cause?: unknown) {
    super(message, context)
    this.code  = code
    this.cause = cause
  }
}

export class BybitTimeoutError extends BybitError {
  public readonly code?: string
  public readonly cause?: unknown

  constructor(message: string, code: string | undefined, context?: BybitErrorContext, cause?: unknown) {
    super(message, context)
    this.code  = code
    this.cause = cause
  }
}

export class BybitAuthError extends BybitError {
  public readonly status: number
  public readonly retCode?: number
  public readonly retMsg?:  string

  constructor(
    message: string,
    status:  number,
    context?: BybitErrorContext,
    payload?: { retCode?: number; retMsg?: string },
  ) {
    super(message, context)
    this.status  = status
    this.retCode = payload?.retCode
    this.retMsg  = payload?.retMsg
  }
}

export class BybitRateLimitError extends BybitError {
  public readonly status: number
  public readonly retryAfterMs?: number
  public readonly limit?:     string
  public readonly remaining?: string
  public readonly resetAt?:   string

  constructor(
    message: string,
    status:  number,
    headers: AxiosResponseHeaders | RawAxiosResponseHeaders | undefined,
    context?: BybitErrorContext,
  ) {
    super(message, context)
    this.status       = status
    this.retryAfterMs = parseRetryAfter(headers)
    this.limit        = headerValue(headers, 'x-bapi-limit')
    this.remaining    = headerValue(headers, 'x-bapi-limit-status')
    this.resetAt      = headerValue(headers, 'x-bapi-limit-reset-timestamp')
  }
}

export class BybitParseError extends BybitError {
  public readonly status?: number
  public readonly cause?:  unknown
  public readonly rawBody?: unknown

  constructor(
    message: string,
    status:  number | undefined,
    rawBody: unknown,
    context?: BybitErrorContext,
    cause?:   unknown,
  ) {
    super(message, context)
    this.status  = status
    this.rawBody = rawBody
    this.cause   = cause
  }
}

function headerValue(
  headers: AxiosResponseHeaders | RawAxiosResponseHeaders | undefined,
  name:    string,
): string | undefined {
  if (!headers) return undefined
  const raw = (headers as Record<string, unknown>)[name] ?? (headers as Record<string, unknown>)[name.toLowerCase()]
  if (raw === undefined || raw === null) return undefined
  return Array.isArray(raw) ? raw[0] : String(raw)
}

function parseRetryAfter(
  headers: AxiosResponseHeaders | RawAxiosResponseHeaders | undefined,
): number | undefined {
  const raw = headerValue(headers, 'retry-after')
  if (!raw) return undefined
  const asSeconds = Number(raw)
  if (Number.isFinite(asSeconds)) return Math.round(asSeconds * 1000)
  const asDate = Date.parse(raw)
  if (Number.isFinite(asDate)) return Math.max(0, asDate - Date.now())
  return undefined
}

export function translateAxiosError(err: unknown, context: BybitErrorContext): BybitError {
  if (err instanceof BybitError) return err
  const axiosErr = err as AxiosError | undefined

  if (axiosErr && axiosErr.isAxiosError) {
    const code = axiosErr.code
    if (code === 'ECONNABORTED' || code === 'ETIMEDOUT') {
      return new BybitTimeoutError(`Request timed out: ${axiosErr.message}`, code, context, err)
    }

    const response = axiosErr.response
    if (!response) {
      return new BybitNetworkError(`Network error: ${axiosErr.message}`, code, context, err)
    }

    const status  = response.status
    const headers = response.headers
    const data    = response.data

    if (status === 429) {
      return new BybitRateLimitError('Rate limit exceeded', status, headers, context)
    }
    if (status === 403 && isCloudflareBlock(headers, data)) {
      return new BybitRateLimitError('Request blocked (likely IP/rate-limit)', status, headers, context)
    }
    if (status === 401 || status === 403) {
      return new BybitAuthError(
        `Authentication failed (HTTP ${status})`,
        status,
        context,
        extractRet(data),
      )
    }

    if (data && typeof data === 'object' && 'retCode' in data) {
      return new BybitApiError(data as ApiResponse<unknown>, context)
    }

    return new BybitParseError(
      `Unexpected response (HTTP ${status})`,
      status,
      data,
      context,
      err,
    )
  }

  if (err instanceof SyntaxError) {
    return new BybitParseError('Failed to parse response body', undefined, undefined, context, err)
  }

  return new BybitNetworkError(
    err instanceof Error ? err.message : String(err),
    undefined,
    context,
    err,
  )
}

function isCloudflareBlock(
  headers: AxiosResponseHeaders | RawAxiosResponseHeaders | undefined,
  data:    unknown,
): boolean {
  const server = headerValue(headers, 'server')?.toLowerCase() ?? ''
  if (server.includes('cloudflare')) return true
  if (typeof data === 'string' && /<html/i.test(data)) return true
  return false
}

function extractRet(data: unknown): { retCode?: number; retMsg?: string } | undefined {
  if (!data || typeof data !== 'object') return undefined
  const d = data as Record<string, unknown>
  const out: { retCode?: number; retMsg?: string } = {}
  if (typeof d.retCode === 'number') out.retCode = d.retCode
  if (typeof d.retMsg === 'string')  out.retMsg  = d.retMsg
  return out
}
