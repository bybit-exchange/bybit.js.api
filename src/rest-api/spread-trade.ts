import type { AxiosInstance } from 'axios'
import { requestJson } from '../http/request.js'
import type { ApiResponse } from '../types/common.js'
import type { RestClientOptions } from '../config.js'

type SpreadOrderIdentity =
  { orderId: string; orderLinkId?: string } | { orderId?: string; orderLinkId: string }

type SpreadOrderAmendment = { qty: string; price?: string } | { qty?: string; price: string }

export class SpreadTradeService {
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
   * Get Spread Instruments Info
   * @see https://bybit-exchange.github.io/docs/v5/spread/market/instrument
   */
  async getSpreadInstrumentsInfo(params: {
    symbol?: string
    baseCoin?: string
    limit?: number
    cursor?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path: '/v5/spread/instrument',
      signed: false,
      query: params,
    })
  }

  /**
   * Get Spread Orderbook
   * @see https://bybit-exchange.github.io/docs/v5/spread/market/orderbook
   */
  async getSpreadOrderbook(params: {
    symbol: string
    limit?: number
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path: '/v5/spread/orderbook',
      signed: false,
      query: params,
    })
  }

  /**
   * Get Spread Recent Public Trades
   * @see https://bybit-exchange.github.io/docs/v5/spread/market/recent-trade
   */
  async getSpreadRecentTrades(params: {
    symbol: string
    limit?: number
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path: '/v5/spread/recent-trade',
      signed: false,
      query: params,
    })
  }

  /**
   * Get Spread Tickers
   * @see https://bybit-exchange.github.io/docs/v5/spread/market/tickers
   */
  async getSpreadTickers(params: { symbol: string }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path: '/v5/spread/tickers',
      signed: false,
      query: params,
    })
  }

  /**
   * Amend Order
   * @see https://bybit-exchange.github.io/docs/v5/spread/trade/amend-order
   */
  async amendSpreadOrder(
    params: { symbol: string } & SpreadOrderIdentity & SpreadOrderAmendment,
  ): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path: '/v5/spread/order/amend',
      signed: true,
      body: params,
    })
  }

  /**
   * Cancel All Orders
   * @see https://bybit-exchange.github.io/docs/v5/spread/trade/cancel-all
   */
  async cancelAllSpreadOrders(params: {
    symbol?: string
    cancelAll?: boolean
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path: '/v5/spread/order/cancel-all',
      signed: true,
      body: params,
    })
  }

  /**
   * Cancel Order
   * @see https://bybit-exchange.github.io/docs/v5/spread/trade/cancel-order
   */
  async cancelSpreadOrder(params: SpreadOrderIdentity): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path: '/v5/spread/order/cancel',
      signed: true,
      body: params,
    })
  }

  /**
   * Create Order
   * @see https://bybit-exchange.github.io/docs/v5/spread/trade/create-order
   */
  async createSpreadOrder(params: {
    symbol: string
    side: 'Buy' | 'Sell'
    orderType: 'Limit' | 'Market'
    qty: string
    price?: string
    orderLinkId?: string
    timeInForce?: 'GTC' | 'IOC' | 'FOK' | 'PostOnly'
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path: '/v5/spread/order/create',
      signed: true,
      body: params,
    })
  }

  /**
   * Get Open Orders
   * @see https://bybit-exchange.github.io/docs/v5/spread/trade/open-order
   */
  async getSpreadOpenOrders(params: {
    symbol?: string
    baseCoin?: string
    orderId?: string
    orderLinkId?: string
    limit?: number
    cursor?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path: '/v5/spread/order/realtime',
      signed: true,
      query: params,
    })
  }

  /**
   * Get Order History
   * @see https://bybit-exchange.github.io/docs/v5/spread/trade/order-history
   */
  async getSpreadOrderHistory(params: {
    symbol?: string
    baseCoin?: string
    orderId?: string
    orderLinkId?: string
    startTime?: number
    endTime?: number
    limit?: number
    cursor?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path: '/v5/spread/order/history',
      signed: true,
      query: params,
    })
  }

  /**
   * Get Trade History
   * @see https://bybit-exchange.github.io/docs/v5/spread/trade/trade-history
   */
  async getSpreadTradeHistory(params: {
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
      path: '/v5/spread/execution/list',
      signed: true,
      query: params,
    })
  }

  /** @deprecated Use `getSpreadTradeHistory` instead. */
  async getHistory(
    params: Parameters<SpreadTradeService['getSpreadTradeHistory']>[0],
  ): Promise<ApiResponse<unknown>> {
    return this.getSpreadTradeHistory(params)
  }

  /**
   * Get Spread Wallet Balance
   * @see https://bybit-exchange.github.io/docs/v5/spread/trade/max-qty
   */
  async getSpreadMaxQty(params: {
    symbol: string
    side: '1' | '2'
    orderPrice: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path: '/v5/spread/max-qty',
      signed: true,
      query: params,
    })
  }
}
