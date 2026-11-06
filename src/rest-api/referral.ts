import type { AxiosInstance } from 'axios'
import { requestJson } from '../http/request.js'
import type { ApiResponse } from '../types/common.js'
import type { RestClientOptions } from '../config.js'

export class ReferralService {
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
   * Get referral rules and campaign task rewards for the current site
   * @see https://bybit-exchange.github.io/docs/v5/referral/referral-campaign-rewards
   */
  async getCampaignRewards(): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path: '/v5/referral/campaign/rewards',
      signed: true,
      body: {},
    })
  }

  /**
   * Get Referral Commission Records
   * @see https://bybit-exchange.github.io/docs/v5/referral/referral-commission-records
   */
  async getCommissionRecords(params: {
    userIdList?: Array<number>
    startTime?: string
    endTime?: string
    page?: number
    pageSize?: number
    productLine?: 0 | 1 | 2 | 3 | 4 | 6 | 9
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path: '/v5/referral/commission/records',
      signed: true,
      body: params,
    })
  }

  /**
   * Get Referral User Identity Profile
   * @see https://bybit-exchange.github.io/docs/v5/referral/referral-user-identity-profile
   */
  async getUserIdentityProfile(): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path: '/v5/referral/user/identity-profile',
      signed: true,
      body: {},
    })
  }

  /**
   * Get referral user invitations
   * @see https://bybit-exchange.github.io/docs/v5/referral/referral-user-invitations
   */
  async getUserInvitations(params: {
    userIdList?: Array<number>
    startTime?: string
    endTime?: string
    page?: number
    pageSize?: number
    friendStatus?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path: '/v5/referral/user/invitations',
      signed: true,
      body: params,
    })
  }
}
