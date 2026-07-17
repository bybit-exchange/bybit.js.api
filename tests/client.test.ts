import axios from 'axios'
import { BybitClient } from '../src/client'
import { BASE_URL_MAINNET, BASE_URL_TESTNET, DEFAULT_TIMEOUT_MS } from '../src/config'

// Bypass the mutually-exclusive check for a subset of tests below.
const anyOpts = (o: unknown) => o as never

describe('BybitClient — service surface', () => {
  it('exposes all 14 service instances on the client', () => {
    const c = new BybitClient()
    for (const svc of [
      'account', 'affiliate', 'asset', 'bot', 'broker', 'cryptoLoan',
      'earn', 'market', 'p2p', 'position', 'rfq', 'spotMargin', 'trade', 'user',
    ]) {
      expect((c as unknown as Record<string, unknown>)[svc]).toBeDefined()
    }
  })

  it('does NOT expose the removed rateLimit service', () => {
    const c = new BybitClient() as unknown as Record<string, unknown>
    expect(c.rateLimit).toBeUndefined()
  })
})

describe('BybitClient — HTTP setup', () => {
  it('defaults to mainnet baseURL', () => {
    const c = new BybitClient()
    expect(c.http.defaults.baseURL).toBe(BASE_URL_MAINNET)
  })

  it('routes to testnet when testnet=true', () => {
    const c = new BybitClient({ testnet: true })
    expect(c.http.defaults.baseURL).toBe(BASE_URL_TESTNET)
  })

  it('uses provided baseUrl over testnet flag', () => {
    const custom = 'https://custom.example/api'
    const c = new BybitClient({ baseUrl: custom })
    expect(c.http.defaults.baseURL).toBe(custom)
  })

  it('applies default timeout', () => {
    const c = new BybitClient()
    expect(c.http.defaults.timeout).toBe(DEFAULT_TIMEOUT_MS)
  })

  it('applies caller-provided timeout', () => {
    const c = new BybitClient({ timeout: 42_000 })
    expect(c.http.defaults.timeout).toBe(42_000)
  })

  it('reuses a user-provided axios instance', () => {
    const instance = axios.create({ baseURL: 'https://custom.example/api' })
    const c = new BybitClient({ axiosInstance: instance })
    expect(c.http).toBe(instance)
  })

  it('throws when axiosInstance conflicts with baseUrl/testnet/timeout', () => {
    const instance = axios.create()
    expect(() => new BybitClient(anyOpts({ axiosInstance: instance, testnet: true }))).toThrow(/mutually exclusive/)
    expect(() => new BybitClient(anyOpts({ axiosInstance: instance, baseUrl: 'https://x' }))).toThrow(/mutually exclusive/)
    expect(() => new BybitClient(anyOpts({ axiosInstance: instance, timeout: 1000 }))).toThrow(/mutually exclusive/)
  })
})

describe('BybitClient — apiSecret privacy', () => {
  it('does not leak apiSecret through JSON.stringify(client)', () => {
    const c = new BybitClient({ apiKey: 'k', apiSecret: 'THE-SECRET' })
    const serialized = JSON.stringify(c)
    expect(serialized).not.toContain('THE-SECRET')
    const parsed = JSON.parse(serialized)
    expect(parsed.options.apiSecret).toBe('[REDACTED]')
    expect(parsed.options.apiKey).toBe('k')
  })

  it('does not enumerate options on the instance', () => {
    const c = new BybitClient({ apiKey: 'k', apiSecret: 'THE-SECRET' })
    const keys = Object.keys(c)
    expect(keys).not.toContain('options')
  })

  it('redactedOptions() marks axiosInstance as [provided]', () => {
    const instance = axios.create()
    const c = new BybitClient({ apiKey: 'k', apiSecret: 's', axiosInstance: instance })
    const safe = c.redactedOptions()
    expect(safe.apiSecret).toBe('[REDACTED]')
    expect(safe.axiosInstance).toBe('[provided]')
  })
})
