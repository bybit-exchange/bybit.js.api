import type { AxiosInstance } from 'axios'
import { requestJson } from '../http/request.js'
import type { ApiResponse } from '../types/common.js'
import type { RestClientOptions } from '../config.js'

export class TaxService {
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
   * Batch create tax report files
   * @see https://bybit-exchange.github.io/docs/v5/tax/batch-create
   */
  async batchCreateTaxReports(params: {
    startTime: number
    endTime: number
    items: Array<{ type: string; number: string }>
    sourceInstitution?: string
    exportFileType?: 'csv' | 'orc'
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path: '/v5/fht/compliance/tax/private/batch_create',
      signed: true,
      body: params,
    })
  }

  /**
   * Query batch tax report status
   * @see https://bybit-exchange.github.io/docs/v5/tax/batch-query
   */
  async batchQueryTaxReports(params: { batchId: string }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path: '/v5/fht/compliance/tax/private/batch_query',
      signed: true,
      query: params,
    })
  }
}
