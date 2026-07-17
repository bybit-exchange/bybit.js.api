import type { AxiosInstance } from 'axios'
import { requestJson } from '../http/request.js'
import type { ApiResponse } from '../types/common.js'
import type { RfqCounterpartyItem, RfqLegItem } from '../types/nested.js'
import type { RestClientOptions } from '../config.js'

export class RfqService {
  constructor(
    protected readonly http: AxiosInstance,
    protected readonly opts: RestClientOptions,
  ) {}

  /**
   * Accept Non-LP Quote
   */
  async acceptNonLpQuote(params: {
    rfqId: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/rfq/accept-other-quote',
      signed: true,
      body: {
        rfqId: params.rfqId,
      },
    })
  }

  /**
   * Cancel All Quotes
   */
  async cancelAllQuotes(): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/rfq/cancel-all-quotes',
      signed: true,
    })
  }

  /**
   * Cancel All RFQs
   */
  async cancelAllRfqs(): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/rfq/cancel-all-rfq',
      signed: true,
    })
  }

  /**
   * Cancel Quote
   */
  async cancelQuote(params: {
    quoteId?:     string
    rfqId?:       string
    quoteLinkId?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/rfq/cancel-quote',
      signed: true,
      body: {
        quoteId:     params.quoteId,
        rfqId:       params.rfqId,
        quoteLinkId: params.quoteLinkId,
      },
    })
  }

  /**
   * Cancel RFQ
   */
  async cancelRfq(params: {
    rfqId?:     string
    rfqLinkId?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/rfq/cancel-rfq',
      signed: true,
      body: {
        rfqId:     params.rfqId,
        rfqLinkId: params.rfqLinkId,
      },
    })
  }

  /**
   * Create Quote
   */
  async createQuote(params: {
    rfqId:          string
    quoteLinkId?:   string
    anonymous?:     boolean
    expireIn?:      number
    quoteBuyList?:  RfqLegItem[]
    quoteSellList?: RfqLegItem[]
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/rfq/create-quote',
      signed: true,
      body: {
        rfqId:         params.rfqId,
        quoteLinkId:   params.quoteLinkId,
        anonymous:     params.anonymous,
        expireIn:      params.expireIn,
        quoteBuyList:  params.quoteBuyList,
        quoteSellList: params.quoteSellList,
      },
    })
  }

  /**
   * Create RFQ
   */
  async createRfq(params: {
    counterparties: RfqCounterpartyItem[]
    list:           RfqLegItem[]
    rfqLinkId?:     string
    anonymous?:     boolean
    strategyType?:  string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/rfq/create-rfq',
      signed: true,
      body: {
        counterparties: params.counterparties,
        list:           params.list,
        rfqLinkId:      params.rfqLinkId,
        anonymous:      params.anonymous,
        strategyType:   params.strategyType,
      },
    })
  }

  /**
   * Execute Quote
   */
  async executeQuote(params: {
    rfqId:     string
    quoteId:   string
    quoteSide: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/rfq/execute-quote',
      signed: true,
      body: {
        rfqId:     params.rfqId,
        quoteId:   params.quoteId,
        quoteSide: params.quoteSide,
      },
    })
  }

  /**
   * Get Public Trades
   */
  async getPublicTrades(params: {
    startTime?: number
    endTime?:   number
    limit?:     number
    cursor?:    string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/rfq/public-trades',
      signed: true,
      query: {
        startTime: params.startTime,
        endTime:   params.endTime,
        limit:     params.limit,
        cursor:    params.cursor,
      },
    })
  }

  /**
   * Get Quotes
   */
  async getQuotes(params: {
    rfqId?:       string
    quoteId?:     string
    quoteLinkId?: string
    traderType?:  string
    status?:      string
    limit?:       number
    cursor?:      string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/rfq/quote-list',
      signed: true,
      query: {
        rfqId:       params.rfqId,
        quoteId:     params.quoteId,
        quoteLinkId: params.quoteLinkId,
        traderType:  params.traderType,
        status:      params.status,
        limit:       params.limit,
        cursor:      params.cursor,
      },
    })
  }

  /**
   * Get Quotes Realtime
   */
  async getQuotesRealtime(params: {
    rfqId?:       string
    quoteId?:     string
    quoteLinkId?: string
    traderType?:  string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/rfq/quote-realtime',
      signed: true,
      query: {
        rfqId:       params.rfqId,
        quoteId:     params.quoteId,
        quoteLinkId: params.quoteLinkId,
        traderType:  params.traderType,
      },
    })
  }

  /**
   * Get RFQ Config
   */
  async getRfqConfig(): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/rfq/config',
      signed: true,
    })
  }

  /**
   * Get RFQs
   */
  async getRfqs(params: {
    rfqId?:      string
    rfqLinkId?:  string
    traderType?: string
    status?:     string
    limit?:      number
    cursor?:     string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/rfq/rfq-list',
      signed: true,
      query: {
        rfqId:      params.rfqId,
        rfqLinkId:  params.rfqLinkId,
        traderType: params.traderType,
        status:     params.status,
        limit:      params.limit,
        cursor:     params.cursor,
      },
    })
  }

  /**
   * Get RFQs Realtime
   */
  async getRfqsRealtime(params: {
    rfqId?:      string
    rfqLinkId?:  string
    traderType?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/rfq/rfq-realtime',
      signed: true,
      query: {
        rfqId:      params.rfqId,
        rfqLinkId:  params.rfqLinkId,
        traderType: params.traderType,
      },
    })
  }

  /**
   * Get Trade History
   */
  async getTradeHistory(params: {
    rfqId?:       string
    rfqLinkId?:   string
    quoteId?:     string
    quoteLinkId?: string
    traderType?:  string
    status?:      string
    limit?:       number
    cursor?:      string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/rfq/trade-list',
      signed: true,
      query: {
        rfqId:       params.rfqId,
        rfqLinkId:   params.rfqLinkId,
        quoteId:     params.quoteId,
        quoteLinkId: params.quoteLinkId,
        traderType:  params.traderType,
        status:      params.status,
        limit:       params.limit,
        cursor:      params.cursor,
      },
    })
  }
}
