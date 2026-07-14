import type { AxiosInstance } from 'axios'
import { requestJson } from '../http/request'
import type { ApiResponse } from '../types/common'
import type { RestClientOptions } from '../config'

export class AssetService {
  constructor(
    protected readonly http: AxiosInstance,
    protected readonly opts: RestClientOptions,
  ) {}

  /**
   * Get Coin Balance
   */
  async getCoinBalance(params: {
    accountType: string
    memberId?:   string
    coin?:       string
    withBonus?:  number
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/asset/transfer/query-account-coins-balance',
      signed: true,
      query: {
        accountType: params.accountType,
        memberId:    params.memberId,
        coin:        params.coin,
        withBonus:   params.withBonus,
      },
    })
  }

  /**
   * Get Coin Greeks
   */
  async getCoinGreeks(params: {
    baseCoin?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/asset/coin-greeks',
      signed: true,
      query: {
        baseCoin: params.baseCoin,
      },
    })
  }

  /**
   * Get Funding History
   */
  async queryFundingDetailApi(params: {
    createTimeFrom?: string
    createTimeTo?:   string
    limit?:          string
    cursor?:         string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/asset/fundinghistory',
      signed: true,
      query: {
        createTimeFrom: params.createTimeFrom,
        createTimeTo:   params.createTimeTo,
        limit:          params.limit,
        cursor:         params.cursor,
      },
    })
  }
}
