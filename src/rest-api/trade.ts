import type { AxiosInstance } from 'axios'
import { requestJson } from '../http/request'
import type { ApiResponse } from '../types/common'
import type { RestClientOptions } from '../config'

export interface CreateOrderRequest {
  category:               string
  symbol:                 string
  side:                   string
  orderType:              string
  qty:                    string
  isLeverage?:            number
  marketUnit?:            string
  slippageToleranceType?: string
  slippageTolerance?:     string
  price?:                 string
  triggerDirection?:      number
  orderFilter?:           string
  triggerPrice?:          string
  triggerBy?:             string
  orderIv?:               string
  timeInForce?:           string
  positionIdx?:           string
  orderLinkId?:           string
  takeProfit?:            string
  stopLoss?:              string
  tpTriggerBy?:           string
  slTriggerBy?:           string
  reduceOnly?:            boolean
  closeOnTrigger?:        boolean
  smpType?:               string
  mmp?:                   boolean
  tpslMode?:              string
  tpLimitPrice?:          string
  slLimitPrice?:          string
  tpOrderType?:           string
  slOrderType?:           string
  bboSideType?:           string
  bboLevel?:              string
  rpiTakerAccess?:        boolean
}

export interface AmendOrderRequest {
  category:      string
  symbol:        string
  orderId?:      string
  orderLinkId?:  string
  orderIv?:      string
  triggerPrice?: string
  qty?:          string
  price?:        string
  tpslMode?:     string
  takeProfit?:   string
  stopLoss?:     string
  tpTriggerBy?:  string
  slTriggerBy?:  string
  triggerBy?:    string
  tpLimitPrice?: string
  slLimitPrice?: string
}

export interface CancelOrderRequest {
  category:     string
  symbol:       string
  orderId?:     string
  orderLinkId?: string
  orderFilter?: string
}

export type BatchCreateOrderRequest = Omit<CreateOrderRequest, 'category'>
export type BatchAmendOrderRequest  = Omit<AmendOrderRequest, 'category'>
export type BatchCancelOrderRequest = Omit<CancelOrderRequest, 'category'>

export class TradeService {
  constructor(
    protected readonly http: AxiosInstance,
    protected readonly opts: RestClientOptions,
  ) {}

  /**
   * Get Trade History
   * @see https://bybit-exchange.github.io/docs/v5/order/execution
   */
  async getTradeHistory(params: {
    category:     string
    symbol?:      string
    orderId?:     string
    orderLinkId?: string
    baseCoin?:    string
    settleCoin?:  string
    startTime?:   number
    endTime?:     number
    execType?:    string
    limit?:       number
    cursor?:      string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/execution/list',
      signed: true,
      query: {
        category:    params.category,
        symbol:      params.symbol,
        orderId:     params.orderId,
        orderLinkId: params.orderLinkId,
        baseCoin:    params.baseCoin,
        settleCoin:  params.settleCoin,
        startTime:   params.startTime,
        endTime:     params.endTime,
        execType:    params.execType,
        limit:       params.limit,
        cursor:      params.cursor,
      },
    })
  }

  /**
   * Amend an existing open order (unfilled or partially filled) — modify price, quantity, trigger price, TP/SL, and related parameters.
   * @see https://bybit-exchange.github.io/docs/v5/order/amend-order
   */
  async amendOrder(params: AmendOrderRequest): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/order/amend',
      signed: true,
      body: {
        category:     params.category,
        symbol:       params.symbol,
        orderId:      params.orderId,
        orderLinkId:  params.orderLinkId,
        orderIv:      params.orderIv,
        triggerPrice: params.triggerPrice,
        qty:          params.qty,
        price:        params.price,
        tpslMode:     params.tpslMode,
        takeProfit:   params.takeProfit,
        stopLoss:     params.stopLoss,
        tpTriggerBy:  params.tpTriggerBy,
        slTriggerBy:  params.slTriggerBy,
        triggerBy:    params.triggerBy,
        tpLimitPrice: params.tpLimitPrice,
        slLimitPrice: params.slLimitPrice,
      },
    })
  }

  /**
   * Batch amend multiple orders in a single request.
   * @see https://bybit-exchange.github.io/docs/v5/order/batch-amend
   */
  async batchAmendOrders(params: {
    category: string
    request:  BatchAmendOrderRequest[]
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/order/amend-batch',
      signed: true,
      body: {
        category: params.category,
        request:  params.request,
      },
    })
  }

  /**
   * Batch cancel multiple orders in a single request.
   * @see https://bybit-exchange.github.io/docs/v5/order/batch-cancel
   */
  async batchCancelOrders(params: {
    category: string
    request:  BatchCancelOrderRequest[]
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/order/cancel-batch',
      signed: true,
      body: {
        category: params.category,
        request:  params.request,
      },
    })
  }

  /**
   * Batch place multiple orders in a single request.
   * @see https://bybit-exchange.github.io/docs/v5/order/batch-place
   */
  async batchCreateOrders(params: {
    category: string
    request:  BatchCreateOrderRequest[]
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/order/create-batch',
      signed: true,
      body: {
        category: params.category,
        request:  params.request,
      },
    })
  }

  /**
   * Cancel all open orders, filtered by symbol / baseCoin / settleCoin / order filter / stop order type.
   * @see https://bybit-exchange.github.io/docs/v5/order/cancel-all
   */
  async cancelAllOrders(params: {
    category:       string
    symbol?:        string
    baseCoin?:      string
    settleCoin?:    string
    orderFilter?:   string
    stopOrderType?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/order/cancel-all',
      signed: true,
      body: {
        category:      params.category,
        symbol:        params.symbol,
        baseCoin:      params.baseCoin,
        settleCoin:    params.settleCoin,
        orderFilter:   params.orderFilter,
        stopOrderType: params.stopOrderType,
      },
    })
  }

  /**
   * Cancel a single unfilled or partially filled order.
   * @see https://bybit-exchange.github.io/docs/v5/order/cancel-order
   */
  async cancelOrder(params: CancelOrderRequest): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/order/cancel',
      signed: true,
      body: {
        category:    params.category,
        symbol:      params.symbol,
        orderId:     params.orderId,
        orderLinkId: params.orderLinkId,
        orderFilter: params.orderFilter,
      },
    })
  }

  /**
   * Place a new order (spot, linear, inverse, or option).
   * @see https://bybit-exchange.github.io/docs/v5/order/create-order
   */
  async createOrder(params: CreateOrderRequest): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/order/create',
      signed: true,
      body: {
        category:              params.category,
        symbol:                params.symbol,
        side:                  params.side,
        orderType:             params.orderType,
        qty:                   params.qty,
        isLeverage:            params.isLeverage,
        marketUnit:            params.marketUnit,
        slippageToleranceType: params.slippageToleranceType,
        slippageTolerance:     params.slippageTolerance,
        price:                 params.price,
        triggerDirection:      params.triggerDirection,
        orderFilter:           params.orderFilter,
        triggerPrice:          params.triggerPrice,
        triggerBy:             params.triggerBy,
        orderIv:               params.orderIv,
        timeInForce:           params.timeInForce,
        positionIdx:           params.positionIdx,
        orderLinkId:           params.orderLinkId,
        takeProfit:            params.takeProfit,
        stopLoss:              params.stopLoss,
        tpTriggerBy:           params.tpTriggerBy,
        slTriggerBy:           params.slTriggerBy,
        reduceOnly:            params.reduceOnly,
        closeOnTrigger:        params.closeOnTrigger,
        smpType:               params.smpType,
        mmp:                   params.mmp,
        tpslMode:              params.tpslMode,
        tpLimitPrice:          params.tpLimitPrice,
        slLimitPrice:          params.slLimitPrice,
        tpOrderType:           params.tpOrderType,
        slOrderType:           params.slOrderType,
        bboSideType:           params.bboSideType,
        bboLevel:              params.bboLevel,
        rpiTakerAccess:        params.rpiTakerAccess,
      },
    })
  }

  /**
   * Set the DCP (Disconnected Cancel All) time window — alternate operation on the same endpoint as setDcp.
   * @see https://bybit-exchange.github.io/docs/v5/order/dcp
   */
  async dcpSetTimewindow(params: {
    timeWindow: number
    product?:   string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/order/disconnected-cancel-all',
      signed: true,
      body: {
        timeWindow: params.timeWindow,
        product:    params.product,
      },
    })
  }

  /**
   * Query unfilled or partially filled orders in real-time; can also fetch historical orders within the last 500 records.
   * @see https://bybit-exchange.github.io/docs/v5/order/open-order
   */
  async getOpenOrders(params: {
    category:     string
    symbol?:      string
    baseCoin?:    string
    settleCoin?:  string
    orderId?:     string
    orderLinkId?: string
    openOnly?:    number
    orderFilter?: string
    limit?:       number
    cursor?:      string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/order/realtime',
      signed: true,
      query: {
        category:    params.category,
        symbol:      params.symbol,
        baseCoin:    params.baseCoin,
        settleCoin:  params.settleCoin,
        orderId:     params.orderId,
        orderLinkId: params.orderLinkId,
        openOnly:    params.openOnly,
        orderFilter: params.orderFilter,
        limit:       params.limit,
        cursor:      params.cursor,
      },
    })
  }

  /**
   * Query historical order records (last 2 years).
   * @see https://bybit-exchange.github.io/docs/v5/order/order-list
   */
  async getOrderHistory(params: {
    category:     string
    symbol?:      string
    baseCoin?:    string
    settleCoin?:  string
    orderId?:     string
    orderLinkId?: string
    orderFilter?: string
    orderStatus?: string
    startTime?:   number
    endTime?:     number
    limit?:       number
    cursor?:      string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/order/history',
      signed: true,
      query: {
        category:    params.category,
        symbol:      params.symbol,
        baseCoin:    params.baseCoin,
        settleCoin:  params.settleCoin,
        orderId:     params.orderId,
        orderLinkId: params.orderLinkId,
        orderFilter: params.orderFilter,
        orderStatus: params.orderStatus,
        startTime:   params.startTime,
        endTime:     params.endTime,
        limit:       params.limit,
        cursor:      params.cursor,
      },
    })
  }

  /**
   * Query the max borrow quota for Unified Trading Account spot margin trading.
   * @see https://bybit-exchange.github.io/docs/v5/order/spot-borrow-quota
   */
  async getSpotBorrowQuota(params: {
    category: string
    symbol:   string
    side:     string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/order/spot-borrow-check',
      signed: true,
      query: {
        category: params.category,
        symbol:   params.symbol,
        side:     params.side,
      },
    })
  }

  /**
   * Pre-check a potential order to estimate margin impact before actually placing it (Portfolio Margin mode only).
   * @see https://bybit-exchange.github.io/docs/v5/order/pre-check-order
   */
  async preCheckOrder(params: {
    category:      string
    symbol:        string
    side:          string
    orderType:     string
    qty:           string
    price?:        string
    isLeverage?:   number
    timeInForce?:  string
    positionIdx?:  string
    orderLinkId?:  string
    takeProfit?:   string
    stopLoss?:     string
    tpTriggerBy?:  string
    slTriggerBy?:  string
    reduceOnly?:   boolean
    tpslMode?:     string
    tpLimitPrice?: string
    slLimitPrice?: string
    tpOrderType?:  string
    slOrderType?:  string
    orderIv?:      string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/order/pre-check',
      signed: true,
      body: {
        category:     params.category,
        symbol:       params.symbol,
        side:         params.side,
        orderType:    params.orderType,
        qty:          params.qty,
        price:        params.price,
        isLeverage:   params.isLeverage,
        timeInForce:  params.timeInForce,
        positionIdx:  params.positionIdx,
        orderLinkId:  params.orderLinkId,
        takeProfit:   params.takeProfit,
        stopLoss:     params.stopLoss,
        tpTriggerBy:  params.tpTriggerBy,
        slTriggerBy:  params.slTriggerBy,
        reduceOnly:   params.reduceOnly,
        tpslMode:     params.tpslMode,
        tpLimitPrice: params.tpLimitPrice,
        slLimitPrice: params.slLimitPrice,
        tpOrderType:  params.tpOrderType,
        slOrderType:  params.slOrderType,
        orderIv:      params.orderIv,
      },
    })
  }
}
