import axios from 'axios'
import { BybitClient } from '../src/client'
import { BASE_URL_MAINNET, BASE_URL_TESTNET } from '../src/config'

describe('BybitClient instance', () => {
  it('exposes every service on the client', () => {
    const c = new BybitClient()
    expect(c.account).toBeDefined()
    expect(c.market).toBeDefined()
    expect(c.trade).toBeDefined()
    expect(c.position).toBeDefined()
    expect(c.asset).toBeDefined()
    expect(c.user).toBeDefined()
  })

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

  it('reuses a user-provided axios instance', () => {
    const instance = axios.create({ baseURL: 'https://custom.example/api' })
    const c = new BybitClient({ axiosInstance: instance })
    expect(c.http).toBe(instance)
  })

  it('throws when axiosInstance conflicts with baseUrl/testnet/timeout', () => {
    const instance = axios.create()
    expect(() => new BybitClient({ axiosInstance: instance, testnet: true })).toThrow(/mutually exclusive/)
    expect(() => new BybitClient({ axiosInstance: instance, baseUrl: 'https://x' })).toThrow(/mutually exclusive/)
    expect(() => new BybitClient({ axiosInstance: instance, timeout: 1000 })).toThrow(/mutually exclusive/)
  })
})
