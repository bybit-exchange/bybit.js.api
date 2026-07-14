import type { AxiosInstance } from 'axios'
import { requestJson } from '../http/request'
import type { ApiResponse } from '../types/common'
import type { RestClientOptions } from '../config'

export class BrokerService {
  constructor(
    protected readonly http: AxiosInstance,
    protected readonly opts: RestClientOptions,
  ) {}

  /**
   * Distribute voucher
   */
  async distributeAward(params: {
    accountId: string
    awardId:   string
    specCode:  string
    amount:    string
    brokerId:  string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/broker/award/distribute-award',
      signed: true,
      body: {
        accountId: params.accountId,
        awardId:   params.awardId,
        specCode:  params.specCode,
        amount:    params.amount,
        brokerId:  params.brokerId,
      },
    })
  }

  /**
   * Get voucher details
   */
  async getAwardInfo(params: {
    id: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/broker/award/info',
      signed: true,
      body: {
        id: params.id,
      },
    })
  }

  /**
   * Query voucher distribution record
   */
  async getDistributionRecord(params: {
    accountId:       string
    awardId:         string
    specCode:        string
    withUsedAmount?: boolean
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/broker/award/distribution-record',
      signed: true,
      body: {
        accountId:      params.accountId,
        awardId:        params.awardId,
        specCode:       params.specCode,
        withUsedAmount: params.withUsedAmount,
      },
    })
  }

  /**
   * Get Broker Account Info
   */
  async queryBrokerAccountInfo(): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/broker/account-info',
      signed: true,
    })
  }

  /**
   * Query Broker All UID Rate Limits
   */
  async queryBrokerAllUidDetails(params: {
    uids?:   string
    limit?:  number
    cursor?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/broker/apilimit/query-all',
      signed: true,
      query: {
        uids:   params.uids,
        limit:  params.limit,
        cursor: params.cursor,
      },
    })
  }

  /**
   * Query Broker Rate Limit Cap
   */
  async queryBrokerCap(): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/broker/apilimit/query-cap',
      signed: true,
    })
  }

  /**
   * Get Broker Earnings Info
   */
  async queryBrokerEarning(params: {
    bizType?: string
    begin?:   string
    end?:     string
    uid?:     string
    limit?:   number
    cursor?:  string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/broker/earnings-info',
      signed: true,
      query: {
        bizType: params.bizType,
        begin:   params.begin,
        end:     params.end,
        uid:     params.uid,
        limit:   params.limit,
        cursor:  params.cursor,
      },
    })
  }

  /**
   * Set Broker API Rate Limit
   */
  async setBrokerApiLimit(params: {
    list?: Array<Record<string, unknown>>
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/broker/apilimit/set',
      signed: true,
      body: {
        list: params.list,
      },
    })
  }
}
