import type { AxiosInstance } from 'axios'
import { requestJson } from '../http/request.js'
import type { ApiResponse } from '../types/common.js'
import type { RestClientOptions } from '../config.js'

export type StrategyCategory =
  | 'UTA_USDT'
  | 'UTA_USDC'
  | 'UTA_USDC_FUTURE'
  | 'UTA_SPOT'
  | 'UTA_INVERSE'
  | 'UTA_INVERSE_FUTURE'
  | 'UTA_USDT_FUTURE'

type StrategyBase = {
  category: StrategyCategory
  symbol: string
  side: 'Buy' | 'Sell'
  reduceOnly?: boolean
  positionIdx?: 0 | 1 | 2
  leverageType?: 0 | 1
}

type SizeOrPositionValue =
  { size: string; positionValue?: never } | { size?: never; positionValue: string }

type PovStopCondition =
  | (SizeOrPositionValue & { duration?: number })
  | { size?: never; positionValue?: never; duration: number }

type ChaseStrategyRequest = StrategyBase &
  SizeOrPositionValue & {
    strategyType: 'chaseOrder'
    chaseDistance?: string
    chasePercentE4?: number
    maxChasePrice?: string
    triggerPrice?: string
  }

type IcebergStrategyRequest = StrategyBase &
  SizeOrPositionValue & {
    strategyType: 'iceberg'
    subSize?: string
    subPositionValue?: string
    orderCount?: number
    limitPrice?: string
    chaseDistance?: string
    chasePercentE4?: number
    maxChasePrice?: string
    postOnly?: 0 | 1
  }

type PovStrategyRequest = StrategyBase &
  PovStopCondition & {
    strategyType: 'pov'
    interval?: number
    povParams: {
      mode: 'TradedVolume' | 'OppositeSideLiquidity' | 'SameSideLiquidity'
      participationRate: string
      referenceWindow?: string
      depthReference?: number
    }
  }

type TwapStrategyRequest = StrategyBase &
  SizeOrPositionValue & {
    strategyType: 'twap'
    duration: number
    interval?: number
    isRandom?: boolean
    triggerPrice?: string
    maxChasePrice?: string
    chaseDistance?: string
    chasePercentE4?: number
  }

export type CreateStrategyRequest =
  ChaseStrategyRequest | IcebergStrategyRequest | PovStrategyRequest | TwapStrategyRequest

export type StrategyOrderStatus = '2' | '3' | '4' | '5' | '6' | '7'

export class StrategyService {
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
   * Create a strategy order
   * @see https://bybit-exchange.github.io/docs/v5/strategy/create-strategy
   */
  async createStrategy(params: CreateStrategyRequest): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path: '/v5/strategy/create',
      signed: true,
      body: params,
    })
  }

  /**
   * Query orders created by a specific strategy
   * @see https://bybit-exchange.github.io/docs/v5/strategy/order-list
   */
  async queryOrderList(params: {
    strategyId: string
    status?: StrategyOrderStatus
    symbol?: string
    beginTimeE0?: number
    endTimeE0?: number
    pageSize?: number
    cursor?: string
    strategyType?: 'twap' | 'chaseOrder' | 'iceberg' | 'pov'
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path: '/v5/strategy/order-list',
      signed: true,
      query: params,
    })
  }

  /**
   * Query trading strategy list with filters
   * @see https://bybit-exchange.github.io/docs/v5/strategy/strategy-list
   */
  async queryList(params: {
    strategyId?: string
    status?: '2' | '3' | '4' | '5' | '6'
    symbol?: string
    category?:
      | 'UTA_USDT'
      | 'UTA_USDC'
      | 'UTA_USDC_FUTURE'
      | 'UTA_SPOT'
      | 'UTA_INVERSE'
      | 'UTA_INVERSE_FUTURE'
      | 'UTA_USDT_FUTURE'
    strategyType?: 'twap' | 'chaseOrder' | 'iceberg' | 'pov'
    beginTimeE0?: number
    endTimeE0?: number
    pageSize?: number
    cursor?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path: '/v5/strategy/list',
      signed: true,
      query: params,
    })
  }

  /**
   * Stop a running strategy
   * @see https://bybit-exchange.github.io/docs/v5/strategy/stop-strategy
   */
  async stopStrategy(params: { strategyId: string }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path: '/v5/strategy/stop',
      signed: true,
      body: params,
    })
  }
}
