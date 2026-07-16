import type { AxiosInstance } from 'axios'
import { requestJson } from '../http/request.js'
import type { ApiResponse , Category, Side, OrderType, TimeInForce, OrderStatus, AccountType } from '../types/common.js'
import type { RestClientOptions } from '../config.js'

export class AffiliateService {
  constructor(
    protected readonly http: AxiosInstance,
    protected readonly opts: RestClientOptions,
  ) {}

  /**
   * Get affiliate sub-affiliate list
   * @see https://bybit-exchange.github.io/docs/v5/affiliate/affiliate-sub-list
   */
  async getAffiliateSubList(params?: {
    cursor?:    string
    size?:      number
    startDate?: string
    endDate?:   string
    subAffId?:  number
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/affiliate/affiliate-sub-list',
      signed: true,
      query: {
        cursor:    params?.cursor,
        size:      params?.size,
        startDate: params?.startDate,
        endDate:   params?.endDate,
        subAffId:  params?.subAffId,
      },
    })
  }

  /**
   * Get affiliate user list
   */
  async getAffiliateUserList(params?: {
    cursor?:      string
    size?:        number
    needDeposit?: boolean
    need30?:      boolean
    need365?:     boolean
    startDate?:   string
    endDate?:     string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/affiliate/aff-user-list',
      signed: true,
      query: {
        cursor:      params?.cursor,
        size:        params?.size,
        needDeposit: params?.needDeposit,
        need30:      params?.need30,
        need365:     params?.need365,
        startDate:   params?.startDate,
        endDate:     params?.endDate,
      },
    })
  }
}
