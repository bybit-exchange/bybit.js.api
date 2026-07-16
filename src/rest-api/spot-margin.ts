import type { AxiosInstance } from 'axios'
import { requestJson } from '../http/request.js'
import type { ApiResponse , Category, Side, OrderType, TimeInForce, OrderStatus, AccountType } from '../types/common.js'
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
}
