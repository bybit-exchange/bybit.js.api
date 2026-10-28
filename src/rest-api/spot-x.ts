import type { AxiosInstance } from 'axios'
import { requestJson } from '../http/request.js'
import type { ApiResponse } from '../types/common.js'
import type { RestClientOptions } from '../config.js'

export class SpotXService {
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
   * Get Launchpool project (activity) list
   * @see https://bybit-exchange.github.io/docs/v5/finance/spot-x/launchpool/launchpool-project-list
   */
  async getLaunchpoolProjectList(params: {
    status: number
    activityCoin?: string
    projectId?: string
    cursor?: string
    limit?: number
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path: '/v5/spot-x/launchpool/project/list',
      signed: false,
      query: params,
    })
  }

  /**
   * Get user's staking operation records
   * @see https://bybit-exchange.github.io/docs/v5/finance/spot-x/launchpool/launchpool-activity-log
   */
  async getLaunchpoolUserActivityLog(params: {
    stakeCoin?: string
    type?: number
    status?: number
    startTime?: string
    endTime?: string
    pageSize?: number
    current?: number
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path: '/v5/spot-x/launchpool/user/activity-log',
      signed: true,
      body: params,
    })
  }

  /**
   * Get user's active staking positions
   * @see https://bybit-exchange.github.io/docs/v5/finance/spot-x/launchpool/launchpool-current-staking
   */
  async getLaunchpoolUserCurrentStaking(): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path: '/v5/spot-x/launchpool/user/current-staking',
      signed: true,
    })
  }

  /**
   * Get user's completed staking position history
   * @see https://bybit-exchange.github.io/docs/v5/finance/spot-x/launchpool/launchpool-user-history
   */
  async getLaunchpoolUserHistory(params: {
    stakeCoin?: string
    rewardCoin?: string
    startTime?: string
    endTime?: string
    pageSize?: number
    current?: number
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path: '/v5/spot-x/launchpool/user/history',
      signed: true,
      body: params,
    })
  }

  /**
   * Get Puzzle project (activity) list
   * @see https://bybit-exchange.github.io/docs/v5/finance/spot-x/puzzle/puzzle-project-list
   */
  async getPuzzleProjectList(params: {
    status: number
    projectId?: string
    activityCoin?: string
    cursor?: string
    limit?: number
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path: '/v5/spot-x/puzzle/project/list',
      signed: false,
      query: params,
    })
  }

  /**
   * Get Token Splash project (activity) list
   * @see https://bybit-exchange.github.io/docs/v5/finance/spot-x/token-splash/token-splash-project-list
   */
  async getTokenSplashProjectList(params: {
    status: number
    projectId?: string
    activityCoin?: string
    cursor?: string
    limit?: number
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path: '/v5/spot-x/token-splash/project/list',
      signed: false,
      query: params,
    })
  }

  /**
   * Get user's Token Splash trade-task progress
   * @see https://bybit-exchange.github.io/docs/v5/finance/spot-x/token-splash/token-splash-user-activity-params
   */
  async getTokenSplashUserActivityParams(params: {
    projectId?: string
    activityCoin?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path: '/v5/spot-x/token-splash/user/activity-params',
      signed: true,
      query: params,
    })
  }
}
