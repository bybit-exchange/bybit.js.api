import type { AxiosInstance } from 'axios'
import { requestJson } from '../http/request.js'
import type { ApiResponse } from '../types/common.js'
import type { RestClientOptions } from '../config.js'

export class LendingService {
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
   * Bind/Unbind UID
   * @see https://bybit-exchange.github.io/docs/v5/ins-loan/association-uid
   */
  async insLoanAssociationUid(params: {
    uid: string
    operate: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path: '/v5/ins-loan/association-uid',
      signed: true,
      body: params,
    })
  }

  /**
   * Get Coin Delta Amount
   * @see https://bybit-exchange.github.io/docs/v5/ins-loan/coin-delta-amount
   */
  async insLoanCoinDeltaAmount(params: {
    coin?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path: '/v5/ins-loan/coin-delta-amount',
      signed: true,
      query: params,
    })
  }

  /**
   * Get Delay Liquidation Status
   * @see https://bybit-exchange.github.io/docs/v5/ins-loan/delay-liq-status
   */
  async insLoanDelayLiqStatus(): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path: '/v5/ins-loan/delay-liq-status',
      signed: true,
    })
  }

  /**
   * Get Margin Tokens
   * @see https://bybit-exchange.github.io/docs/v5/ins-loan/ensure-tokens
   */
  async insLoanEnsureTokens(params: {
    productId?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path: '/v5/ins-loan/ensure-tokens',
      signed: true,
      query: params,
    })
  }

  /**
   * Get Margin Token Conversion Details
   * @see https://bybit-exchange.github.io/docs/v5/ins-loan/ensure-tokens-convert
   */
  async insLoanEnsureTokensConvert(params: {
    productId?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path: '/v5/ins-loan/ensure-tokens-convert',
      signed: true,
      query: params,
    })
  }

  /**
   * Get Loan Orders
   * @see https://bybit-exchange.github.io/docs/v5/ins-loan/loan-order
   */
  async insLoanGetLoanOrder(params: {
    orderId?: string
    startTime?: number
    endTime?: number
    limit?: number
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path: '/v5/ins-loan/loan-order',
      signed: true,
      query: params,
    })
  }

  /**
   * Get LTV with Conversion Details
   * @see https://bybit-exchange.github.io/docs/v5/ins-loan/ltv-convert
   */
  async insLoanLtvConvert(): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path: '/v5/ins-loan/ltv-convert',
      signed: true,
    })
  }

  /**
   * Get Product Infos
   * @see https://bybit-exchange.github.io/docs/v5/ins-loan/product-infos
   */
  async insLoanProductInfos(params: {
    productId?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path: '/v5/ins-loan/product-infos',
      signed: true,
      query: params,
    })
  }

  /**
   * Get Repaid History
   * @see https://bybit-exchange.github.io/docs/v5/ins-loan/repaid-history
   */
  async insLoanRepaidHistory(params: {
    startTime?: number
    endTime?: number
    limit?: number
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path: '/v5/ins-loan/repaid-history',
      signed: true,
      query: params,
    })
  }

  /**
   * Repay Loan
   * @see https://bybit-exchange.github.io/docs/v5/ins-loan/repay-loan
   */
  async insLoanRepayLoan(params: {
    token: string
    quantity: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path: '/v5/ins-loan/repay-loan',
      signed: true,
      body: params,
    })
  }

}
