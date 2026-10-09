import axios, { type AxiosRequestConfig } from 'axios'
import { BybitClient } from '../src/client'

const goodBody = { retCode: 0, retMsg: 'OK', result: {}, retExtInfo: {}, time: 1 }

function capturingClient(): { client: BybitClient; calls: AxiosRequestConfig[] } {
  const calls: AxiosRequestConfig[] = []
  const instance = axios.create()
  ;(instance as unknown as { request: (config: AxiosRequestConfig) => unknown }).request = (
    config,
  ) => {
    calls.push(config)
    return Promise.resolve({ status: 200, data: goodBody, headers: {}, statusText: '', config })
  }
  return {
    client: new BybitClient({ apiKey: 'K', apiSecret: 'S', axiosInstance: instance }),
    calls,
  }
}

function expectPost(
  calls: AxiosRequestConfig[],
  path: string,
  body: Record<string, unknown>,
): void {
  const call = calls.at(-1)
  expect(call?.method).toBe('POST')
  expect(call?.url).toBe(path)
  expect(JSON.parse(String(call?.data))).toEqual(body)
}

describe('AlphaService — official request contracts', () => {
  it('sends string arrays for batch token requests', async () => {
    const { client, calls } = capturingClient()

    await client.alpha.getLpPayTokenPrice({ tokenCode: ['CEX_1', 'CEX_2'], chainCode: 'SOL' })
    expectPost(calls, '/v5/alpha/lp/pay-token-price', {
      tokenCode: ['CEX_1', 'CEX_2'],
      chainCode: 'SOL',
    })

    await client.alpha.getPredictionOrderBook({ tokenIds: ['token_yes_123', 'token_no_123'] })
    expectPost(calls, '/v5/alpha/prediction/order-book', {
      tokenIds: ['token_yes_123', 'token_no_123'],
    })

    await client.alpha.getPredictionTokenPrice({ tokenIds: ['token_yes_123', 'token_no_123'] })
    expectPost(calls, '/v5/alpha/prediction/token-price', {
      tokenIds: ['token_yes_123', 'token_no_123'],
    })
  })

  it('uses numeric prediction enums for buy, sell, and estimate', async () => {
    const { client, calls } = capturingClient()

    await client.alpha.executePredictionBuy({
      tokenId: 'token_yes_123',
      amount: '100',
      payTokenCode: 'USDC',
      orderType: 1,
      slippage: '0.05',
      eventId: 'event_123',
    })
    expectPost(calls, '/v5/alpha/prediction/buy', {
      tokenId: 'token_yes_123',
      amount: '100',
      payTokenCode: 'USDC',
      orderType: 1,
      slippage: '0.05',
      eventId: 'event_123',
    })

    await client.alpha.executePredictionSell({
      tokenId: 'token_yes_123',
      size: '50',
      orderType: 1,
      slippage: '0.05',
      eventId: 'event_123',
      toTokenCode: 'USDC',
    })
    expectPost(calls, '/v5/alpha/prediction/sell', {
      tokenId: 'token_yes_123',
      size: '50',
      orderType: 1,
      slippage: '0.05',
      eventId: 'event_123',
      toTokenCode: 'USDC',
    })

    await client.alpha.getPredictionOrderEstimate({
      tokenId: 'token_yes_123',
      side: 1,
      eventId: 'event_123',
      amount: '100',
      orderType: 1,
      payTokenCode: 'USDC',
    })
    expectPost(calls, '/v5/alpha/prediction/order-estimate', {
      tokenId: 'token_yes_123',
      side: 1,
      eventId: 'event_123',
      amount: '100',
      orderType: 1,
      payTokenCode: 'USDC',
    })
  })

  it('sends the documented price history and side market fields', async () => {
    const { client, calls } = capturingClient()

    await client.alpha.getPredictionPriceHistory({ tokenId: 'token_yes_123', interval: '1H' })
    expectPost(calls, '/v5/alpha/prediction/price-history', {
      tokenId: 'token_yes_123',
      interval: '1H',
    })

    await client.alpha.getPredictionSideMarketList({
      eventId: 'event_123',
      sortBy: 'volume',
      marketType: 1,
      limit: 20,
      pageIndex: 1,
    })
    expectPost(calls, '/v5/alpha/prediction/side-market-list', {
      eventId: 'event_123',
      sortBy: 'volume',
      marketType: 1,
      limit: 20,
      pageIndex: 1,
    })
  })

  it('sends documented filters for positions and portfolio summary', async () => {
    const { client, calls } = capturingClient()

    await client.alpha.getPredictionPositionHistory({
      tokenId: 'token_yes_123',
      eventId: 'event_123',
      result: 1,
      days: 30,
      limit: 20,
      pageIndex: 1,
    })
    expectPost(calls, '/v5/alpha/prediction/position-history', {
      tokenId: 'token_yes_123',
      eventId: 'event_123',
      result: 1,
      days: 30,
      limit: 20,
      pageIndex: 1,
    })

    await client.alpha.getPredictionPositionList({
      tokenId: 'token_yes_123',
      eventId: 'event_123',
      limit: 20,
      pageIndex: 1,
    })
    expectPost(calls, '/v5/alpha/prediction/position-list', {
      tokenId: 'token_yes_123',
      eventId: 'event_123',
      limit: 20,
      pageIndex: 1,
    })

    await client.alpha.getPredictionPortfolioSummary({ eventType: 1 })
    expectPost(calls, '/v5/alpha/prediction/portfolio-summary', { eventType: 1 })
  })
})
