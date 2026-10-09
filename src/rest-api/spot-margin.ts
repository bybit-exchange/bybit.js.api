import type { AxiosInstance } from 'axios'
import { requestJson } from '../http/request.js'
import type { ApiResponse } from '../types/common.js'
import type { RestClientOptions } from '../config.js'

export class SpotMarginService {
  constructor(
    protected readonly http: AxiosInstance,
    protected readonly opts: RestClientOptions,
  ) {}

  /**
   * Get Historical Interest Rate
   * @see https://bybit-exchange.github.io/docs/v5/spot-margin-uta/historical-interest
   */
  async getHistoricalInterestRate(params: {
    currency:   string
    vipLevel?:  string
    startTime?: number
    endTime?:   number
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/spot-margin-trade/interest-rate-history',
      signed: true,
      query: {
        currency:  params.currency,
        vipLevel:  params.vipLevel,
        startTime: params.startTime,
        endTime:   params.endTime,
      },
    })
  }

  /**
   * Get Position Tiers
   * @see https://bybit-exchange.github.io/docs/v5/spot-margin-uta/position-tiers
   */
  async getPositionTiers(params?: {
    currency?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/spot-margin-trade/position-tiers',
      signed: true,
      query: {
        currency: params?.currency,
      },
    })
  }

  /**
   * Get Tiered Collateral Ratio
   * @see https://bybit-exchange.github.io/docs/v5/spot-margin-uta/tier-collateral-ratio
   */
  async getTieredCollateralRatio(params?: {
    currency?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/spot-margin-trade/collateral',
      signed: false,
      query: {
        currency: params?.currency,
      },
    })
  }

  /**
   * Get VIP Margin Data
   * @see https://bybit-exchange.github.io/docs/v5/spot-margin-uta/vip-margin
   */
  async getVipMarginData(params?: {
    vipLevel?: string
    currency?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/spot-margin-trade/data',
      signed: false,
      query: {
        vipLevel: params?.vipLevel,
        currency: params?.currency,
      },
    })
  }

  /**
   * Get Spot Margin Coin State
   * @see https://bybit-exchange.github.io/docs/v5/spot-margin-trade/coinstate
   */
  async getTradeCoinState(params: {
    currency?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path: '/v5/spot-margin-trade/coinstate',
      signed: true,
      query: params,
    })
  }

  /**
   * Query Fixed-Rate Available Inventory
   * @see https://bybit-exchange.github.io/docs/v5/spot-margin-trade/fixed-available-inventory
   */
  async queryFixedAvailableInventory(params: {
    currency: string
    term: string
    annualRate: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path: '/v5/spot-margin-trade/fixed-available-inventory',
      signed: true,
      query: params,
    })
  }

  /**
   * Fixed-Rate Borrow
   * @see https://bybit-exchange.github.io/docs/v5/spot-margin-trade/fixedborrow
   */
  async accountFixedBorrow(params: {
    orderCurrency: string
    orderAmount: string
    annualRate: string
    term: string
    repayType?: string
    strategyType?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path: '/v5/spot-margin-trade/fixedborrow',
      signed: true,
      body: params,
    })
  }

  /**
   * Query Fixed-Rate Borrow Contracts
   * @see https://bybit-exchange.github.io/docs/v5/spot-margin-trade/fixedborrow-contract-info
   */
  async queryFixedBorrowContracts(params: {
    orderId?: string
    orderCurrency?: string
    term?: string
    limit?: string
    cursor?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path: '/v5/spot-margin-trade/fixedborrow-contract-info',
      signed: true,
      query: params,
    })
  }

  /**
   * Query Fixed-Rate Borrow Orders
   * @see https://bybit-exchange.github.io/docs/v5/spot-margin-trade/fixedborrow-order-info
   */
  async queryFixedBorrowOrders(params: {
    orderId?: string
    orderCurrency?: string
    state?: string
    term?: string
    limit?: string
    cursor?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path: '/v5/spot-margin-trade/fixedborrow-order-info',
      signed: true,
      query: params,
    })
  }

  /**
   * Query Fixed-Rate Borrow Market
   * @see https://bybit-exchange.github.io/docs/v5/spot-margin-trade/fixedborrow-order-quote
   */
  async queryFixedBorrowMarket(params: {
    orderCurrency: string
    term?: string
    orderBy: string
    sort?: number
    limit?: number
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path: '/v5/spot-margin-trade/fixedborrow-order-quote',
      signed: true,
      query: params,
    })
  }

  /**
   * Renew Fixed-Rate Borrow
   * @see https://bybit-exchange.github.io/docs/v5/spot-margin-trade/fixedborrow-renew
   */
  async renewFixedBorrow(params: {
    loanId: string
    qty?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path: '/v5/spot-margin-trade/fixedborrow-renew',
      signed: true,
      body: params,
    })
  }

  /**
   * Get Flexible Available Inventory
   * @see https://bybit-exchange.github.io/docs/v5/spot-margin-trade/flexible-available-inventory
   */
  async getTradeFlexibleAvailableInventory(params: {
    currency: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path: '/v5/spot-margin-trade/flexible-available-inventory',
      signed: true,
      query: params,
    })
  }

  /**
   * Get Auto Repay Mode
   * @see https://bybit-exchange.github.io/docs/v5/spot-margin-trade/get-auto-repay-mode
   */
  async getTradeAutoRepayMode(params: {
    currency?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path: '/v5/spot-margin-trade/get-auto-repay-mode',
      signed: true,
      query: params,
    })
  }

  /**
   * Query Borrow Liability
   * @see https://bybit-exchange.github.io/docs/v5/spot-margin-trade/liability
   */
  async queryBorrowLiability(params: {
    currency: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path: '/v5/spot-margin-trade/liability',
      signed: true,
      query: params,
    })
  }

  /**
   * Get Max Borrowable Amount
   * @see https://bybit-exchange.github.io/docs/v5/spot-margin-trade/max-borrowable
   */
  async getTradeMaxBorrowable(params: {
    currency: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path: '/v5/spot-margin-trade/max-borrowable',
      signed: true,
      query: params,
    })
  }

  /**
   * Get Repayment Available Amount
   * @see https://bybit-exchange.github.io/docs/v5/spot-margin-trade/repayment-available-amount
   */
  async getTradeRepaymentAvailableAmount(params: {
    currency: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path: '/v5/spot-margin-trade/repayment-available-amount',
      signed: true,
      query: params,
    })
  }

  /**
   * Set Auto Repay Mode
   * @see https://bybit-exchange.github.io/docs/v5/spot-margin-trade/set-auto-repay-mode
   */
  async setAutoRepayMode(params: {
    currency?: string
    autoRepayMode: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path: '/v5/spot-margin-trade/set-auto-repay-mode',
      signed: true,
      body: params,
    })
  }

  /**
   * Set spot cross margin leverage
   * @see https://bybit-exchange.github.io/docs/v5/spot-margin-trade/set-leverage
   */
  async spotMarginSetLeverage(params: {
    leverage: string
    currency?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path: '/v5/spot-margin-trade/set-leverage',
      signed: true,
      body: params,
    })
  }

  /**
   * Get Spot Margin Trade Status
   * @see https://bybit-exchange.github.io/docs/v5/spot-margin-trade/state
   */
  async getTradeState(): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path: '/v5/spot-margin-trade/state',
      signed: true,
    })
  }

  /**
   * Toggle spot cross margin mode
   * @see https://bybit-exchange.github.io/docs/v5/spot-margin-trade/switch-mode
   */
  async spotMarginSwitchMode(params: {
    spotMarginMode: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path: '/v5/spot-margin-trade/switch-mode',
      signed: true,
      body: params,
    })
  }

}
