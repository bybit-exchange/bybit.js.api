import type { AxiosError, AxiosResponseHeaders, RawAxiosResponseHeaders } from 'axios'
import type { ApiResponse } from '../types/common.js'

export interface BybitErrorContext {
  method:      string
  path:        string
  timestamp?:  string
  recvWindow?: string
}

// Bybit V5 retCodes that indicate authentication failure.
const AUTH_RET_CODES: ReadonlySet<number> = new Set([
  10003, // API key invalid
  10004, // Sign error
  10005, // Permission denied
  10007, // User authentication failed
  10008, // Common auth error
  10009, // IP not whitelisted
  10010, // Unmatched IP
  10029, // Timestamp for request too old / recv_window mismatch
])

// Bybit V5 retCodes that indicate rate limiting.
const RATE_LIMIT_RET_CODES: ReadonlySet<number> = new Set([
  10006, // Too many visits (per-account)
  10018, // Request frequency too high (per-IP)
])

export function isAuthRetCode(retCode: number): boolean       { return AUTH_RET_CODES.has(retCode) }
export function isRateLimitRetCode(retCode: number): boolean  { return RATE_LIMIT_RET_CODES.has(retCode) }

export abstract class BybitError extends Error {
  public readonly context?: BybitErrorContext

  protected constructor(message: string, context?: BybitErrorContext, cause?: unknown) {
    super(message, cause !== undefined ? { cause } : undefined)
    this.name = new.target.name
    this.context = context
    Object.setPrototypeOf(this, new.target.prototype)
  }

  toJSON(): Record<string, unknown> {
    return {
      name:    this.name,
      message: this.message,
      context: this.context,
    }
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

  override toJSON(): Record<string, unknown> {
    return { ...super.toJSON(), retCode: this.retCode, retMsg: this.retMsg, time: this.time }
  }
}

export class BybitNetworkError extends BybitError {
  public readonly code?: string

  constructor(message: string, code: string | undefined, context?: BybitErrorContext, cause?: unknown) {
    super(message, context, cause)
    this.code = code
  }
}

export class BybitTimeoutError extends BybitError {
  public readonly code?: string

  constructor(message: string, code: string | undefined, context?: BybitErrorContext, cause?: unknown) {
    super(message, context, cause)
    this.code = code
  }
}

export class BybitAuthError extends BybitError {
  public readonly status?: number
  public readonly retCode?: number
  public readonly retMsg?:  string

  constructor(
    message:  string,
    status:   number | undefined,
    context?: BybitErrorContext,
    payload?: { retCode?: number; retMsg?: string },
  ) {
    super(message, context)
    this.status  = status
    this.retCode = payload?.retCode
    this.retMsg  = payload?.retMsg
  }

  override toJSON(): Record<string, unknown> {
    return { ...super.toJSON(), status: this.status, retCode: this.retCode, retMsg: this.retMsg }
  }
}

export class BybitRateLimitError extends BybitError {
  public readonly status?: number
  public readonly retryAfterMs?: number
  public readonly limit?:     string
  public readonly remaining?: string
  public readonly resetAt?:   string
  public readonly retCode?:   number
  public readonly retMsg?:    string

  constructor(
    message:  string,
    status:   number | undefined,
    headers:  AxiosResponseHeaders | RawAxiosResponseHeaders | undefined,
    context?: BybitErrorContext,
    payload?: { retCode?: number; retMsg?: string },
  ) {
    super(message, context)
    this.status       = status
    this.retryAfterMs = parseRetryAfter(headers)
    this.limit        = headerValue(headers, 'x-bapi-limit')
    this.remaining    = headerValue(headers, 'x-bapi-limit-status')
    this.resetAt      = headerValue(headers, 'x-bapi-limit-reset-timestamp')
    this.retCode      = payload?.retCode
    this.retMsg       = payload?.retMsg
  }

  override toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      status: this.status, retryAfterMs: this.retryAfterMs,
      limit:  this.limit,  remaining: this.remaining, resetAt: this.resetAt,
      retCode: this.retCode, retMsg: this.retMsg,
    }
  }
}

export class BybitParseError extends BybitError {
  public readonly status?: number
  public readonly rawBody?: unknown

  constructor(
    message:  string,
    status:   number | undefined,
    rawBody:  unknown,
    context?: BybitErrorContext,
    cause?:   unknown,
  ) {
    super(message, context, cause)
    this.status  = status
    this.rawBody = rawBody
  }
}

export function headerValue(
  headers: AxiosResponseHeaders | RawAxiosResponseHeaders | undefined,
  name:    string,
): string | undefined {
  if (!headers) return undefined
  const lower = name.toLowerCase()
  const raw = (headers as Record<string, unknown>)[name]
    ?? (headers as Record<string, unknown>)[lower]
  if (raw === undefined || raw === null) return undefined
  return Array.isArray(raw) ? String(raw[0]) : String(raw)
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

// Strip credentials/signature from an axios error before storing it in .cause.
export function scrubAxiosError(err: unknown): unknown {
  if (!err || typeof err !== 'object') return err
  const anyErr = err as Record<string, unknown>
  if (!anyErr.isAxiosError) return err
  const scrubbed = {
    name:    anyErr.name,
    message: anyErr.message,
    code:    anyErr.code,
    status:  (anyErr.response as { status?: number } | undefined)?.status,
  }
  return scrubbed
}

export function translateAxiosError(err: unknown, context: BybitErrorContext): BybitError {
  if (err instanceof BybitError) return err
  const axiosErr = err as AxiosError | undefined

  if (axiosErr && axiosErr.isAxiosError) {
    const code = axiosErr.code
    const cause = scrubAxiosError(err)
    if (code === 'ECONNABORTED' || code === 'ETIMEDOUT') {
      return new BybitTimeoutError(`Request timed out: ${axiosErr.message}`, code, context, cause)
    }

    const response = axiosErr.response
    if (!response) {
      return new BybitNetworkError(`Network error: ${axiosErr.message}`, code, context, cause)
    }

    const status  = response.status
    const headers = response.headers
    const data    = response.data

    if (status === 429) {
      return new BybitRateLimitError('Rate limit exceeded', status, headers, context, extractRet(data))
    }
    if (status === 403 && isCloudflareBlock(headers, data)) {
      return new BybitRateLimitError('Request blocked (likely IP/rate-limit)', status, headers, context)
    }
    if (status === 401 || status === 403) {
      return new BybitAuthError(`Authentication failed (HTTP ${status})`, status, context, extractRet(data))
    }

    if (data && typeof data === 'object' && 'retCode' in data) {
      return classifyRetCode(data as ApiResponse<unknown>, context, headers)
    }

    return new BybitParseError(`Unexpected response (HTTP ${status})`, status, data, context, cause)
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

// Dispatch a retCode ≠ 0 response to the appropriate typed error.
export function classifyRetCode(
  response: ApiResponse<unknown>,
  context:  BybitErrorContext,
  headers?: AxiosResponseHeaders | RawAxiosResponseHeaders,
): BybitError {
  const { retCode, retMsg } = response
  if (isAuthRetCode(retCode)) {
    return new BybitAuthError(`Authentication failed: [${retCode}] ${retMsg}`, undefined, context, { retCode, retMsg })
  }
  if (isRateLimitRetCode(retCode)) {
    return new BybitRateLimitError(`Rate limited: [${retCode}] ${retMsg}`, undefined, headers, context, { retCode, retMsg })
  }
  return new BybitApiError(response, context)
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
