import type { AxiosInstance } from 'axios'
import { requestJson } from '../http/request.js'
import type { ApiResponse } from '../types/common.js'
import type { RestClientOptions } from '../config.js'

export class EventService {
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
   * Get Event Contract Order History
   * @see https://bybit-exchange.github.io/docs/v5/event/trade/order-list
   */
  async getEcOrderHistory(params: {
    symbol?: string
    orderId?: string
    orderLinkId?: string
    startTime?: number
    endTime?: number
    limit?: number
    cursor?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path: '/v5/event/order-list',
      signed: true,
      query: params,
    })
  }

  /**
   * Get Event Contract Active Orders
   * @see https://bybit-exchange.github.io/docs/v5/event/trade/open-order
   */
  async getEcActiveOrders(params: {
    symbol?: string
    orderId?: string
    orderLinkId?: string
    limit?: number
    cursor?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path: '/v5/event/order-realtime',
      signed: true,
      query: params,
    })
  }

  /**
   * Get Event Contract Position Info
   * @see https://bybit-exchange.github.io/docs/v5/event/trade/position
   */
  async getEcPositionInfo(params: {
    symbol?: string
    baseCoin?: string
    settleCoin?: string
    limit?: number
    cursor?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path: '/v5/event/positions',
      signed: true,
      query: params,
    })
  }

  /**
   * Get Event Contract Settlement Records
   * @see https://bybit-exchange.github.io/docs/v5/event/trade/settlement
   */
  async getEcSettlements(params: {
    symbol: string
    orderId?: string
    startTime?: number
    endTime?: number
    limit?: number
    cursor?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path: '/v5/event/settlements',
      signed: true,
      query: params,
    })
  }

  /**
   * Get Event Contract Trade History
   * @see https://bybit-exchange.github.io/docs/v5/event/trade/execution
   */
  async getEcTradeHistory(params: {
    symbol: string
    orderId?: string
    orderLinkId?: string
    startTime?: number
    endTime?: number
    limit?: number
    cursor?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path: '/v5/event/trades',
      signed: true,
      query: params,
    })
  }
}
