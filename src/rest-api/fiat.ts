import type { AxiosInstance } from 'axios'
import { requestJson } from '../http/request.js'
import type { ApiResponse } from '../types/common.js'
import type { RestClientOptions } from '../config.js'

export class FiatService {
  protected readonly opts!: RestClientOptions

  constructor(
    protected readonly http: AxiosInstance,
    opts: RestClientOptions,
  ) {
    Object.defineProperty(this, 'opts', {
      value: opts,
      writable: false,
      enumerable: false,
      configurable: false,
    })
  }

  /**
   * Query Account Balance
   * @see https://bybit-exchange.github.io/docs/v5/asset/fiat-convert/balance-query
   */
  async queryBalance(params: {
    accountCategory?: 'fiat' | 'crypto'
    currency?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path: '/v5/fiat/balance-query',
      signed: true,
      query: params,
    })
  }

  /**
   * Get Trading Pairs
   * @see https://bybit-exchange.github.io/docs/v5/asset/fiat-convert/query-coin-list
   */
  async queryCoinList(params: { side?: 0 | 1 }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path: '/v5/fiat/query-coin-list',
      signed: true,
      query: params,
    })
  }

  /**
   * Query Trade History
   * @see https://bybit-exchange.github.io/docs/v5/asset/fiat-convert/query-trade-history
   */
  async queryTradeHistory(params: {
    index?: number
    limit?: number
    startTime?: string
    endTime?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path: '/v5/fiat/query-trade-history',
      signed: true,
      query: params,
    })
  }

  /**
   * Request a Quote
   * @see https://bybit-exchange.github.io/docs/v5/asset/fiat-convert/quote-apply
   */
  async applyQuote(params: {
    fromCoin: string
    fromCoinType: 'fiat' | 'crypto'
    toCoin: string
    toCoinType: 'fiat' | 'crypto'
    requestAmount: string
    requestCoinType?: 'fiat' | 'crypto'
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path: '/v5/fiat/quote-apply',
      signed: true,
      body: params,
    })
  }

  /**
   * Get Reference Price
   * @see https://bybit-exchange.github.io/docs/v5/asset/fiat-convert/reference-price
   */
  async getReferencePrice(params: {
    symbol: string
    paymentMethod?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path: '/v5/fiat/reference-price',
      signed: true,
      query: params,
    })
  }

  /**
   * Confirm Quote and Execute Trade
   * @see https://bybit-exchange.github.io/docs/v5/asset/fiat-convert/confirm-quote
   */
  async confirmQuote(params: {
    quoteTxId: string
    subUserId: string
    webhookUrl?: string
    merchantRequestId?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path: '/v5/fiat/trade-execute',
      signed: true,
      body: params,
    })
  }

  /**
   * Query Trade Status
   * @see https://bybit-exchange.github.io/docs/v5/asset/fiat-convert/query-trade
   */
  async queryTrade(params: {
    tradeNo?: string
    merchantRequestId?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path: '/v5/fiat/trade-query',
      signed: true,
      query: params,
    })
  }
}
