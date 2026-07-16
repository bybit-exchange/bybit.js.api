import type { AxiosInstance } from 'axios'
import { requestJson } from '../http/request.js'
import type { ApiResponse , Category, Side, OrderType, TimeInForce, OrderStatus, AccountType } from '../types/common.js'
import type { P2pPaymentIdItem } from '../types/nested.js'
import type { RestClientOptions } from '../config.js'

export class P2pService {
  constructor(
    protected readonly http: AxiosInstance,
    protected readonly opts: RestClientOptions,
  ) {}

  /**
   * Get Account Information - retrieve the caller's P2P account information.
   */
  async getAccountInfo(): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/p2p/user/personal/info',
      signed: true,
    })
  }

  /**
   * Get Ads - retrieve online P2P advertisements.
   */
  async getAds(params: {
    tokenId:    string
    currencyId: string
    side:       Side
    page?:      string
    size?:      string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/p2p/item/online',
      signed: true,
      body: {
        tokenId:    params.tokenId,
        currencyId: params.currencyId,
        side:       params.side,
        page:       params.page,
        size:       params.size,
      },
    })
  }

  /**
   * Get All Orders - list P2P orders in simplified form.
   */
  async getAllOrders(params: {
    page:       number
    size:       number
    status?:    number
    beginTime?: string
    endTime?:   string
    tokenId?:   string
    side?:      number
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/p2p/order/simplifyList',
      signed: true,
      body: {
        page:      params.page,
        size:      params.size,
        status:    params.status,
        beginTime: params.beginTime,
        endTime:   params.endTime,
        tokenId:   params.tokenId,
        side:      params.side,
      },
    })
  }

  /**
   * Get Chat Message - list chat messages for a P2P order with pagination.
   */
  async getChatMessages(params: {
    orderId:      string
    size:         string
    currentPage?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/p2p/order/message/listpage',
      signed: true,
      body: {
        orderId:     params.orderId,
        size:        params.size,
        currentPage: params.currentPage,
      },
    })
  }

  /**
   * Get counterparty user info for a P2P order.
   */
  async getCounterpartyUserInfo(params: {
    originalUid?: string
    orderId?:     string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/p2p/user/order/personal/info',
      signed: true,
      body: {
        originalUid: params.originalUid,
        orderId:     params.orderId,
      },
    })
  }

  /**
   * Get My Ad Details - retrieve details for a specific P2P advertisement.
   */
  async getMyAdDetails(params: {
    itemId: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/p2p/item/info',
      signed: true,
      body: {
        itemId: params.itemId,
      },
    })
  }

  /**
   * Get My Ads - list the caller's own P2P advertisements.
   */
  async getMyAds(params: {
    itemId?:     string
    status?:     string
    side?:       Side
    tokenId?:    string
    page?:       string
    size?:       string
    currencyId?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/p2p/item/personal/list',
      signed: true,
      body: {
        itemId:     params.itemId,
        status:     params.status,
        side:       params.side,
        tokenId:    params.tokenId,
        page:       params.page,
        size:       params.size,
        currencyId: params.currencyId,
      },
    })
  }

  /**
   * Get Order Detail - retrieve details for a specific P2P order.
   */
  async getOrderDetail(params: {
    orderId: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/p2p/order/info',
      signed: true,
      body: {
        orderId: params.orderId,
      },
    })
  }

  /**
   * Get Pending Orders - list P2P pending orders in simplified form.
   */
  async getPendingOrders(params: {
    page:       number
    size:       number
    status?:    number
    beginTime?: string
    endTime?:   string
    tokenId?:   string
    side?:      number
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/p2p/order/pending/simplifyList',
      signed: true,
      body: {
        page:      params.page,
        size:      params.size,
        status:    params.status,
        beginTime: params.beginTime,
        endTime:   params.endTime,
        tokenId:   params.tokenId,
        side:      params.side,
      },
    })
  }

  /**
   * Get the current user's P2P payment method list.
   */
  async getUserPayment(): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/p2p/user/payment/list',
      signed: true,
    })
  }

  /**
   * Mark Order as Paid - notify the counterparty that payment has been sent.
   */
  async markOrderAsPaid(params: {
    orderId:     string
    paymentType: string
    paymentId:   string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/p2p/order/pay',
      signed: true,
      body: {
        orderId:     params.orderId,
        paymentType: params.paymentType,
        paymentId:   params.paymentId,
      },
    })
  }

  /**
   * Post Ad - create a new P2P advertisement.
   */
  async postAd(params: {
    tokenId:              string
    currencyId:           string
    side:                 Side
    priceType:            string
    premium:              string
    price:                string
    minAmount:            string
    maxAmount:            string
    remark:               string
    tradingPreferenceSet: Record<string, unknown>
    paymentIds:           P2pPaymentIdItem[]
    quantity:             string
    paymentPeriod:        string
    itemType:             string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/p2p/item/create',
      signed: true,
      body: {
        tokenId:              params.tokenId,
        currencyId:           params.currencyId,
        side:                 params.side,
        priceType:            params.priceType,
        premium:              params.premium,
        price:                params.price,
        minAmount:            params.minAmount,
        maxAmount:            params.maxAmount,
        remark:               params.remark,
        tradingPreferenceSet: params.tradingPreferenceSet,
        paymentIds:           params.paymentIds,
        quantity:             params.quantity,
        paymentPeriod:        params.paymentPeriod,
        itemType:             params.itemType,
      },
    })
  }

  /**
   * Release Assets - release assets and complete a P2P order.
   */
  async releaseAssets(params: {
    orderId: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/p2p/order/finish',
      signed: true,
      body: {
        orderId: params.orderId,
      },
    })
  }

  /**
   * Remove Ad - cancel a P2P advertisement.
   */
  async removeAd(params: {
    itemId: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/p2p/item/cancel',
      signed: true,
      body: {
        itemId: params.itemId,
      },
    })
  }

  /**
   * Send Chat Message - send a chat message in a P2P order conversation.
   */
  async sendChatMessage(params: {
    message:     string
    contentType: string
    orderId:     string
    msgUuid:     string
    fileName?:   string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/p2p/order/message/send',
      signed: true,
      body: {
        message:     params.message,
        contentType: params.contentType,
        orderId:     params.orderId,
        msgUuid:     params.msgUuid,
        fileName:    params.fileName,
      },
    })
  }

  /**
   * Update / Relist Ad - modify or relist an existing P2P advertisement.
   */
  async updateAd(params: {
    id:                   string
    priceType:            string
    premium:              string
    price:                string
    minAmount:            string
    maxAmount:            string
    remark:               string
    tradingPreferenceSet: Record<string, unknown>
    paymentIds:           P2pPaymentIdItem[]
    actionType:           string
    quantity:             string
    paymentPeriod:        string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/p2p/item/update',
      signed: true,
      body: {
        id:                   params.id,
        priceType:            params.priceType,
        premium:              params.premium,
        price:                params.price,
        minAmount:            params.minAmount,
        maxAmount:            params.maxAmount,
        remark:               params.remark,
        tradingPreferenceSet: params.tradingPreferenceSet,
        paymentIds:           params.paymentIds,
        actionType:           params.actionType,
        quantity:             params.quantity,
        paymentPeriod:        params.paymentPeriod,
      },
    })
  }

  /**
   * Upload Chat File - upload a file for use in P2P chat.
   */
  async uploadChatFile(params: {
    upload_file: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/p2p/oss/upload_file',
      signed: true,
      body: {
        upload_file: params.upload_file,
      },
    })
  }
}
