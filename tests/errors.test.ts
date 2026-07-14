import type { AxiosError } from 'axios'
import {
  BybitApiError,
  BybitAuthError,
  BybitError,
  BybitNetworkError,
  BybitParseError,
  BybitRateLimitError,
  BybitTimeoutError,
  translateAxiosError,
} from '../src/http/errors'

const ctx = { method: 'GET', path: '/v5/market/tickers' }

function axiosLike(partial: Partial<AxiosError>): AxiosError {
  return Object.assign(new Error('axios'), { isAxiosError: true, ...partial }) as AxiosError
}

describe('BybitError hierarchy', () => {
  it('every concrete error is instanceof BybitError', () => {
    const rateLimit = new BybitRateLimitError('r', 429, {}, ctx)
    expect(rateLimit).toBeInstanceOf(BybitError)
    expect(new BybitApiError({ retCode: 10001, retMsg: 'x', result: {}, retExtInfo: {}, time: 0 })).toBeInstanceOf(BybitError)
    expect(new BybitNetworkError('n', undefined, ctx)).toBeInstanceOf(BybitError)
    expect(new BybitTimeoutError('t', 'ECONNABORTED', ctx)).toBeInstanceOf(BybitError)
    expect(new BybitAuthError('a', 401, ctx)).toBeInstanceOf(BybitError)
    expect(new BybitParseError('p', 500, 'body', ctx)).toBeInstanceOf(BybitError)
  })

  it('preserves BybitError.name matching subclass name', () => {
    expect(new BybitRateLimitError('r', 429, {}, ctx).name).toBe('BybitRateLimitError')
    expect(new BybitTimeoutError('t', 'ECONNABORTED', ctx).name).toBe('BybitTimeoutError')
  })
})

describe('translateAxiosError', () => {
  it('turns ECONNABORTED into BybitTimeoutError', () => {
    const err = translateAxiosError(axiosLike({ code: 'ECONNABORTED', message: 'timeout' }), ctx)
    expect(err).toBeInstanceOf(BybitTimeoutError)
  })

  it('turns a missing response into BybitNetworkError', () => {
    const err = translateAxiosError(axiosLike({ code: 'ECONNRESET', message: 'reset' }), ctx)
    expect(err).toBeInstanceOf(BybitNetworkError)
  })

  it('turns 429 into BybitRateLimitError and parses Retry-After (seconds)', () => {
    const err = translateAxiosError(
      axiosLike({
        response: {
          status: 429,
          data:   '',
          headers: { 'retry-after': '3' },
          statusText: '',
          config: {} as never,
        } as AxiosError['response'],
      }),
      ctx,
    ) as BybitRateLimitError
    expect(err).toBeInstanceOf(BybitRateLimitError)
    expect(err.retryAfterMs).toBe(3000)
  })

  it('turns 401 into BybitAuthError', () => {
    const err = translateAxiosError(
      axiosLike({
        response: {
          status: 401,
          data:   { retCode: 10003, retMsg: 'bad key' },
          headers: {},
          statusText: '',
          config: {} as never,
        } as AxiosError['response'],
      }),
      ctx,
    ) as BybitAuthError
    expect(err).toBeInstanceOf(BybitAuthError)
    expect(err.status).toBe(401)
    expect(err.retCode).toBe(10003)
  })

  it('turns a non-2xx body carrying retCode into BybitApiError', () => {
    const err = translateAxiosError(
      axiosLike({
        response: {
          status: 400,
          data:   { retCode: 10002, retMsg: 'invalid', result: {}, retExtInfo: {}, time: 1 },
          headers: {},
          statusText: '',
          config: {} as never,
        } as AxiosError['response'],
      }),
      ctx,
    ) as BybitApiError
    expect(err).toBeInstanceOf(BybitApiError)
    expect(err.retCode).toBe(10002)
  })

  it('turns HTML/Cloudflare 403 into BybitRateLimitError', () => {
    const err = translateAxiosError(
      axiosLike({
        response: {
          status: 403,
          data:   '<html>blocked</html>',
          headers: { server: 'cloudflare' },
          statusText: '',
          config: {} as never,
        } as AxiosError['response'],
      }),
      ctx,
    )
    expect(err).toBeInstanceOf(BybitRateLimitError)
  })

  it('returns BybitError instances unchanged', () => {
    const original = new BybitApiError({ retCode: 1, retMsg: 'x', result: {}, retExtInfo: {}, time: 0 })
    expect(translateAxiosError(original, ctx)).toBe(original)
  })
})
