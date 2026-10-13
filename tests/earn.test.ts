import axios, { type AxiosRequestConfig } from 'axios'
import { BybitClient } from '../src/client'

const goodBody = { retCode: 0, retMsg: 'OK', result: {}, retExtInfo: {}, time: 1 }

describe('EarnService — official request contracts', () => {
  it('sends Auto Savings coins as repeated query parameters', async () => {
    let captured: AxiosRequestConfig | undefined
    const instance = axios.create()
    ;(instance as unknown as { request: (config: AxiosRequestConfig) => unknown }).request = (
      config,
    ) => {
      captured = config
      return Promise.resolve({ status: 200, data: goodBody, headers: {}, statusText: '', config })
    }
    const client = new BybitClient({ apiKey: 'K', apiSecret: 'S', axiosInstance: instance })

    await client.earn.listAutoSavings({ coins: ['BTC', 'ETH'] })

    expect(captured?.method).toBe('GET')
    expect(captured?.url).toBe('/v5/earn/flexible-saving/auto-savings?coins=BTC&coins=ETH')
  })
})
