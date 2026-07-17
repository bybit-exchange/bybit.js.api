import axios, { type AxiosRequestConfig } from 'axios'
import crypto from 'crypto'
import { requestJson, getRateLimit } from '../src/http/request'
import {
  BybitApiError,
  BybitAuthError,
  BybitNetworkError,
  BybitParseError,
  BybitRateLimitError,
  BybitTimeoutError,
} from '../src/http/errors'

function fakeHttp(handler: (config: AxiosRequestConfig) => { status: number; data: unknown; headers?: Record<string, string> }) {
  const instance = axios.create()
  ;(instance as unknown as { request: (c: AxiosRequestConfig) => unknown }).request = (config: AxiosRequestConfig) => {
    const res = handler(config)
    return Promise.resolve({
      status:     res.status,
      data:       res.data,
      headers:    res.headers ?? {},
      statusText: '',
      config,
    })
  }
  return instance
}

function failingHttp(err: unknown) {
  const instance = axios.create()
  ;(instance as unknown as { request: () => unknown }).request = () => Promise.reject(err)
  return instance
}

const goodBody = { retCode: 0, retMsg: 'OK', result: { ok: true }, retExtInfo: {}, time: 1 }

describe('requestJson — signing', () => {
  it('signs GET requests over the sorted query string', async () => {
    let captured: AxiosRequestConfig | undefined
    const http = fakeHttp((cfg) => {
      captured = cfg
      return { status: 200, data: goodBody }
    })
    await requestJson(http, { apiKey: 'K', apiSecret: 'S', recvWindow: '5000' }, {
      method: 'GET',
      path:   '/v5/account/wallet-balance',
      signed: true,
      query:  { coin: 'BTC', accountType: 'UNIFIED' },
    })

    const headers = captured!.headers as Record<string, string>
    expect(captured!.url).toBe('/v5/account/wallet-balance?accountType=UNIFIED&coin=BTC')
    expect(headers['X-BAPI-API-KEY']).toBe('K')
    expect(headers['X-BAPI-RECV-WINDOW']).toBe('5000')
    expect(headers['X-BAPI-SIGN-TYPE']).toBe('2')
    const ts = headers['X-BAPI-TIMESTAMP']
    const expected = crypto
      .createHmac('sha256', 'S')
      .update(ts + 'K' + '5000' + 'accountType=UNIFIED&coin=BTC')
      .digest('hex')
    expect(headers['X-BAPI-SIGN']).toBe(expected)
  })

  it('signs POST requests over the exact bytes it puts on the wire', async () => {
    let captured: AxiosRequestConfig | undefined
    const http = fakeHttp((cfg) => {
      captured = cfg
      return { status: 200, data: goodBody }
    })
    await requestJson(http, { apiKey: 'K', apiSecret: 'S' }, {
      method: 'POST',
      path:   '/v5/order/create',
      signed: true,
      body:   { symbol: 'BTCUSDT', side: 'Buy' },
    })

    const headers = captured!.headers as Record<string, string>
    const sentBody = captured!.data as string
    expect(typeof sentBody).toBe('string')
    expect(headers['Content-Type']).toBe('application/json')
    const ts = headers['X-BAPI-TIMESTAMP']
    const expected = crypto
      .createHmac('sha256', 'S')
      .update(ts + 'K' + '5000' + sentBody)
      .digest('hex')
    expect(headers['X-BAPI-SIGN']).toBe(expected)
    // Ensure the body actually deserializes back to the input (not double-encoded).
    expect(JSON.parse(sentBody)).toEqual({ symbol: 'BTCUSDT', side: 'Buy' })
  })

  it('strips undefined AND null from both query and body', async () => {
    let captured: AxiosRequestConfig | undefined
    const http = fakeHttp((cfg) => {
      captured = cfg
      return { status: 200, data: goodBody }
    })
    await requestJson(http, { apiKey: 'K', apiSecret: 'S' }, {
      method: 'POST',
      path:   '/v5/foo',
      signed: true,
      query:  { keep: 'yes', drop1: undefined, drop2: null },
      body:   { keep: 'yes', drop1: undefined, drop2: null },
    })
    expect(captured!.url).toBe('/v5/foo?keep=yes')
    expect(JSON.parse(captured!.data as string)).toEqual({ keep: 'yes' })
  })

  it('rejects signed calls without api credentials', async () => {
    const http = fakeHttp(() => ({ status: 200, data: goodBody }))
    await expect(
      requestJson(http, {}, { method: 'GET', path: '/x', signed: true }),
    ).rejects.toThrow(/requires apiKey/)
  })
})

describe('requestJson — response translation', () => {
  it('throws BybitApiError when retCode !== 0', async () => {
    const http = fakeHttp(() => ({
      status: 200,
      data:   { retCode: 10001, retMsg: 'bad', result: {}, retExtInfo: {}, time: 1 },
    }))
    await expect(
      requestJson(http, {}, { method: 'GET', path: '/x', signed: false }),
    ).rejects.toBeInstanceOf(BybitApiError)
  })

  it('propagates the retCode 0 body verbatim', async () => {
    const http = fakeHttp(() => ({ status: 200, data: goodBody }))
    const body = await requestJson<{ ok: boolean }>(http, {}, {
      method: 'GET', path: '/x', signed: false,
    })
    expect(body.retCode).toBe(0)
    expect(body.result).toEqual({ ok: true })
  })

  it('translates timeout to BybitTimeoutError', async () => {
    const err = Object.assign(new Error('timeout'), { isAxiosError: true, code: 'ECONNABORTED' })
    const http = failingHttp(err)
    await expect(
      requestJson(http, {}, { method: 'GET', path: '/x', signed: false }),
    ).rejects.toBeInstanceOf(BybitTimeoutError)
  })

  it('translates network failure (no response) to BybitNetworkError', async () => {
    const err = Object.assign(new Error('reset'), { isAxiosError: true, code: 'ECONNRESET' })
    const http = failingHttp(err)
    await expect(
      requestJson(http, {}, { method: 'GET', path: '/x', signed: false }),
    ).rejects.toBeInstanceOf(BybitNetworkError)
  })

  it('translates 429 response to BybitRateLimitError with retry-after', async () => {
    const err = Object.assign(new Error('rate'), {
      isAxiosError: true,
      response: { status: 429, data: '', headers: { 'retry-after': '2' }, statusText: '', config: {} },
    })
    const http = failingHttp(err)
    try {
      await requestJson(http, {}, { method: 'GET', path: '/x', signed: false })
      throw new Error('should have thrown')
    } catch (e) {
      expect(e).toBeInstanceOf(BybitRateLimitError)
      expect((e as BybitRateLimitError).retryAfterMs).toBe(2000)
    }
  })

  it('translates 401 to BybitAuthError', async () => {
    const err = Object.assign(new Error('auth'), {
      isAxiosError: true,
      response: { status: 401, data: { retCode: 10003, retMsg: 'bad key' }, headers: {}, statusText: '', config: {} },
    })
    const http = failingHttp(err)
    await expect(
      requestJson(http, { apiKey: 'K', apiSecret: 'S' }, {
        method: 'GET', path: '/x', signed: true,
      }),
    ).rejects.toBeInstanceOf(BybitAuthError)
  })

  it('exposes rate limit headers via getRateLimit()', async () => {
    const http = fakeHttp(() => ({
      status:  200,
      data:    goodBody,
      headers: {
        'x-bapi-limit':                     '600',
        'x-bapi-limit-status':              '599',
        'x-bapi-limit-reset-timestamp':     '1700000000000',
      },
    }))
    const body = await requestJson(http, {}, { method: 'GET', path: '/x', signed: false })
    const rl = getRateLimit(body)
    expect(rl).toBeDefined()
    expect(rl?.limit).toBe('600')
    expect(rl?.remaining).toBe('599')
    expect(rl?.resetAt).toBe('1700000000000')
  })

  it('signs a GET with no query params (empty payload)', async () => {
    let captured: AxiosRequestConfig | undefined
    const http = fakeHttp((cfg) => {
      captured = cfg
      return { status: 200, data: goodBody }
    })
    await requestJson(http, { apiKey: 'K', apiSecret: 'S' }, {
      method: 'GET', path: '/v5/account/info', signed: true,
    })
    const headers = captured!.headers as Record<string, string>
    const ts = headers['X-BAPI-TIMESTAMP']
    const expected = crypto.createHmac('sha256', 'S').update(ts + 'K5000').digest('hex')
    expect(headers['X-BAPI-SIGN']).toBe(expected)
    expect(captured!.url).toBe('/v5/account/info')
  })

  it('attaches request context to translated errors', async () => {
    const err = Object.assign(new Error('n'), { isAxiosError: true, code: 'ECONNRESET' })
    const http = failingHttp(err)
    try {
      await requestJson(http, {}, { method: 'POST', path: '/v5/order/create', signed: false })
      throw new Error('should have thrown')
    } catch (e) {
      const err = e as BybitNetworkError
      expect(err.context?.method).toBe('POST')
      expect(err.context?.path).toBe('/v5/order/create')
    }
  })
})

describe('requestJson — tripwires (regression fences)', () => {
  it('signed:false + creds present → no X-BAPI-* headers on the wire', async () => {
    let captured: AxiosRequestConfig | undefined
    const http = fakeHttp((cfg) => {
      captured = cfg
      return { status: 200, data: goodBody }
    })
    await requestJson(http, { apiKey: 'K', apiSecret: 'S' }, {
      method: 'GET', path: '/v5/market/tickers', signed: false,
    })
    const headers = captured!.headers as Record<string, string>
    for (const h of ['X-BAPI-API-KEY', 'X-BAPI-SIGN', 'X-BAPI-TIMESTAMP', 'X-BAPI-RECV-WINDOW', 'X-BAPI-SIGN-TYPE']) {
      expect(headers[h]).toBeUndefined()
    }
  })

  it('rate-limit info stays hidden from Object.keys and JSON.stringify', async () => {
    const http = fakeHttp(() => ({
      status:  200,
      data:    goodBody,
      headers: { 'x-bapi-limit': '600', 'x-bapi-limit-status': '599' },
    }))
    const body = await requestJson(http, {}, { method: 'GET', path: '/x', signed: false })
    expect(Object.keys(body)).toEqual(['retCode', 'retMsg', 'result', 'retExtInfo', 'time'])
    expect(JSON.stringify(body)).not.toContain('600')
    // But accessible via helper:
    expect(getRateLimit(body)?.limit).toBe('600')
  })

  it('accepts HTTP-date Retry-After', async () => {
    // Retry-After can be either seconds or an HTTP-date. Test the date path.
    const target = Date.now() + 3000
    const err = Object.assign(new Error('rate'), {
      isAxiosError: true,
      response: {
        status: 429,
        data:   '',
        headers: { 'retry-after': new Date(target).toUTCString() },
        statusText: '',
        config: {},
      },
    })
    const http = failingHttp(err)
    try {
      await requestJson(http, {}, { method: 'GET', path: '/x', signed: false })
      throw new Error('should have thrown')
    } catch (e) {
      expect(e).toBeInstanceOf(BybitRateLimitError)
      const ms = (e as BybitRateLimitError).retryAfterMs
      // Wide tolerance since Date.parse rounds to whole seconds.
      expect(ms).toBeGreaterThanOrEqual(0)
      expect(ms).toBeLessThanOrEqual(5000)
    }
  })

  it('non-CF 403 without retCode → BybitAuthError, not BybitRateLimitError', async () => {
    const err = Object.assign(new Error('forbidden'), {
      isAxiosError: true,
      response: {
        status: 403,
        data:   'permission denied',
        headers: { server: 'nginx' },
        statusText: '',
        config: {},
      },
    })
    const http = failingHttp(err)
    await expect(
      requestJson(http, { apiKey: 'K', apiSecret: 'S' }, { method: 'GET', path: '/x', signed: true }),
    ).rejects.toBeInstanceOf(BybitAuthError)
  })

  it('HTTP 200 with unexpected shape → BybitParseError with the raw body', async () => {
    const http = fakeHttp(() => ({ status: 200, data: { unexpected: true } }))
    try {
      await requestJson(http, {}, { method: 'GET', path: '/x', signed: false })
      throw new Error('should have thrown')
    } catch (e) {
      expect(e).toBeInstanceOf(BybitParseError)
      expect((e as BybitParseError).rawBody).toEqual({ unexpected: true })
    }
  })

  it('auth retCode on HTTP 200 → BybitAuthError (not generic BybitApiError)', async () => {
    const http = fakeHttp(() => ({
      status: 200,
      data:   { retCode: 10004, retMsg: 'sign error', result: {}, retExtInfo: {}, time: 1 },
    }))
    try {
      await requestJson(http, {}, { method: 'GET', path: '/x', signed: false })
      throw new Error('should have thrown')
    } catch (e) {
      expect(e).toBeInstanceOf(BybitAuthError)
      expect((e as BybitAuthError).retCode).toBe(10004)
    }
  })

  it('rate-limit retCode on HTTP 200 → BybitRateLimitError', async () => {
    const http = fakeHttp(() => ({
      status: 200,
      data:   { retCode: 10006, retMsg: 'too many visits', result: {}, retExtInfo: {}, time: 1 },
      headers: { 'x-bapi-limit-status': '0' },
    }))
    try {
      await requestJson(http, {}, { method: 'GET', path: '/x', signed: false })
      throw new Error('should have thrown')
    } catch (e) {
      expect(e).toBeInstanceOf(BybitRateLimitError)
      expect((e as BybitRateLimitError).remaining).toBe('0')
      expect((e as BybitRateLimitError).retCode).toBe(10006)
    }
  })

  it('non-auth / non-rate-limit retCode ≠ 0 → BybitApiError', async () => {
    const http = fakeHttp(() => ({
      status: 200,
      data:   { retCode: 110007, retMsg: 'balance not enough', result: {}, retExtInfo: {}, time: 1 },
    }))
    await expect(
      requestJson(http, {}, { method: 'GET', path: '/x', signed: false }),
    ).rejects.toBeInstanceOf(BybitApiError)
  })
})
