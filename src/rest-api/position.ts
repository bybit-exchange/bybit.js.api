import type { AxiosInstance } from 'axios'
import { requestJson } from '../http/request'
import type { ApiResponse } from '../types/common'
import type { RestClientOptions } from '../config'

export class PositionService {
  constructor(
    protected readonly http: AxiosInstance,
    protected readonly opts: RestClientOptions,
  ) {}

  /**
   * Manually add or reduce margin for an isolated margin position.
   */
  async addReduceMargin(params: {
    category:     string
    symbol:       string
    margin:       string
    positionIdx?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/position/add-margin',
      signed: true,
      body: {
        category:    params.category,
        symbol:      params.symbol,
        margin:      params.margin,
        positionIdx: params.positionIdx,
      },
    })
  }

  /**
   * Confirm new risk limit to remove reduce-only restriction.
   */
  async confirmNewRiskLimit(params: {
    category: string
    symbol:   string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/position/confirm-pending-mmr',
      signed: true,
      body: {
        category: params.category,
        symbol:   params.symbol,
      },
    })
  }

  /**
   * Get closed profit and loss records.
   * @see https://bybit-exchange.github.io/docs/v5/position/close-pnl
   */
  async getClosedPnl(params: {
    category:   string
    symbol?:    string
    startTime?: number
    endTime?:   number
    limit?:     number
    cursor?:    string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/position/closed-pnl',
      signed: true,
      query: {
        category:  params.category,
        symbol:    params.symbol,
        startTime: params.startTime,
        endTime:   params.endTime,
        limit:     params.limit,
        cursor:    params.cursor,
      },
    })
  }

  /**
   * Get closed option position records.
   */
  async getClosePosition(params: {
    category:   string
    symbol?:    string
    startTime?: number
    endTime?:   number
    limit?:     number
    cursor?:    string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/position/get-closed-positions',
      signed: true,
      query: {
        category:  params.category,
        symbol:    params.symbol,
        startTime: params.startTime,
        endTime:   params.endTime,
        limit:     params.limit,
        cursor:    params.cursor,
      },
    })
  }

  /**
   * Get move position (block trade) history.
   * @see https://bybit-exchange.github.io/docs/v5/position/move-position-history
   */
  async getMovePositionHistory(params?: {
    category?:     string
    symbol?:       string
    startTime?:    number
    endTime?:      number
    status?:       string
    blockTradeId?: string
    limit?:        string
    cursor?:       string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/position/move-history',
      signed: true,
      query: {
        category:     params?.category,
        symbol:       params?.symbol,
        startTime:    params?.startTime,
        endTime:      params?.endTime,
        status:       params?.status,
        blockTradeId: params?.blockTradeId,
        limit:        params?.limit,
        cursor:       params?.cursor,
      },
    })
  }

  /**
   * Get position info (real-time).
   * @see https://bybit-exchange.github.io/docs/v5/position
   */
  async getPositionInfo(params: {
    category:    string
    symbol?:     string
    baseCoin?:   string
    settleCoin?: string
    limit?:      number
    cursor?:     string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/position/list',
      signed: true,
      query: {
        category:   params.category,
        symbol:     params.symbol,
        baseCoin:   params.baseCoin,
        settleCoin: params.settleCoin,
        limit:      params.limit,
        cursor:     params.cursor,
      },
    })
  }

  /**
   * Move positions between UIDs via block trade.
   * @see https://bybit-exchange.github.io/docs/v5/position/move-position
   */
  async movePosition(params: {
    fromUid: string
    toUid:   string
    list:    Array<Record<string, unknown>>
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/position/move-positions',
      signed: true,
      body: {
        fromUid: params.fromUid,
        toUid:   params.toUid,
        list:    params.list,
      },
    })
  }

  /**
   * Enable or disable auto-add-margin for a position.
   * @see https://bybit-exchange.github.io/docs/v5/position/auto-add-margin
   */
  async setAutoAddMargin(params: {
    category:      string
    symbol:        string
    autoAddMargin: number
    positionIdx?:  string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/position/set-auto-add-margin',
      signed: true,
      body: {
        category:      params.category,
        symbol:        params.symbol,
        autoAddMargin: params.autoAddMargin,
        positionIdx:   params.positionIdx,
      },
    })
  }

  /**
   * Set leverage for a position.
   * @see https://bybit-exchange.github.io/docs/v5/position/leverage
   */
  async setLeverage(params: {
    category:     string
    symbol:       string
    buyLeverage:  string
    sellLeverage: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/position/set-leverage',
      signed: true,
      body: {
        category:     params.category,
        symbol:       params.symbol,
        buyLeverage:  params.buyLeverage,
        sellLeverage: params.sellLeverage,
      },
    })
  }

  /**
   * Set take profit, stop loss, and trailing stop for a position.
   * @see https://bybit-exchange.github.io/docs/v5/position/trading-stop
   */
  async setTradingStop(params: {
    category:      string
    symbol:        string
    tpslMode:      string
    positionIdx:   string
    takeProfit?:   string
    stopLoss?:     string
    trailingStop?: string
    tpTriggerBy?:  string
    slTriggerBy?:  string
    activePrice?:  string
    tpSize?:       string
    slSize?:       string
    tpLimitPrice?: string
    slLimitPrice?: string
    tpOrderType?:  string
    slOrderType?:  string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/position/trading-stop',
      signed: true,
      body: {
        category:     params.category,
        symbol:       params.symbol,
        tpslMode:     params.tpslMode,
        positionIdx:  params.positionIdx,
        takeProfit:   params.takeProfit,
        stopLoss:     params.stopLoss,
        trailingStop: params.trailingStop,
        tpTriggerBy:  params.tpTriggerBy,
        slTriggerBy:  params.slTriggerBy,
        activePrice:  params.activePrice,
        tpSize:       params.tpSize,
        slSize:       params.slSize,
        tpLimitPrice: params.tpLimitPrice,
        slLimitPrice: params.slLimitPrice,
        tpOrderType:  params.tpOrderType,
        slOrderType:  params.slOrderType,
      },
    })
  }

  /**
   * Switch position mode between one-way and hedge mode.
   * @see https://bybit-exchange.github.io/docs/v5/position/position-mode
   */
  async switchPositionMode(params: {
    category: string
    mode:     number
    symbol?:  string
    coin?:    string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/position/switch-mode',
      signed: true,
      body: {
        category: params.category,
        mode:     params.mode,
        symbol:   params.symbol,
        coin:     params.coin,
      },
    })
  }
}
