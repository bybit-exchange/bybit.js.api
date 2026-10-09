import type { AxiosInstance } from 'axios'
import { requestJson } from '../http/request.js'
import type { ApiResponse } from '../types/common.js'
import type { RestClientOptions } from '../config.js'

export class AlphaService {
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
   * Get LP order history with status and execution details
   * @see https://bybit-exchange.github.io/docs/v5/alpha/lp/order-list
   */
  async getLpOrderList(params: {
    orderType?: number
    tokenCode?: string
    orderStatus?: Array<Record<string, unknown>>
    days?: number
    limit?: number
    pageIndex?: number
    poolAddress?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path: '/v5/alpha/lp/order-list',
      signed: true,
      body: params,
    })
  }

  /**
   * Get list of supported payment tokens
   * @see https://bybit-exchange.github.io/docs/v5/alpha/lp/pay-token-list
   */
  async getLpPayTokenList(params: {
    chainCode?: string
    tokenAddress?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path: '/v5/alpha/lp/pay-token-list',
      signed: true,
      body: params,
    })
  }

  /**
   * Get current prices for payment tokens
   * @see https://bybit-exchange.github.io/docs/v5/alpha/lp/pay-token-price
   */
  async getLpPayTokenPrice(params: {
    tokenCode: string[]
    chainCode?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path: '/v5/alpha/lp/pay-token-price',
      signed: true,
      body: params,
    })
  }

  /**
   * Get detailed information for a specific LP pool
   * @see https://bybit-exchange.github.io/docs/v5/alpha/lp/pool-info
   */
  async getLpPoolInfo(params: {
    poolAddress: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path: '/v5/alpha/lp/pool-info',
      signed: true,
      body: params,
    })
  }

  /**
   * Get LP pool list with optional filters
   * @see https://bybit-exchange.github.io/docs/v5/alpha/lp/pool-list
   */
  async getLpPoolList(params: {
    tokenSymbol?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path: '/v5/alpha/lp/pool-list',
      signed: true,
      body: params,
    })
  }

  /**
   * Get user's LP positions with rewards and current value
   * @see https://bybit-exchange.github.io/docs/v5/alpha/lp/position-list
   */
  async getLpPositionList(): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path: '/v5/alpha/lp/position-list',
      signed: true,
    })
  }

  /**
   * Redeem (withdraw) liquidity from a position
   * @see https://bybit-exchange.github.io/docs/v5/alpha/lp/redeem
   */
  async executeLpRedeem(params: {
    positionId: number
    poolAddress: string
    dercRatio: string
    receiveTokenCode?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path: '/v5/alpha/lp/redeem',
      signed: true,
      body: params,
    })
  }

  /**
   * Stake tokens into an LP pool
   * @see https://bybit-exchange.github.io/docs/v5/alpha/lp/stake
   */
  async executeLpStake(params: {
    positionId: number
    poolAddress: string
    payTokenAmount: string
    payTokenCode: string
    rangeUpper?: string
    rangeLower?: string
    priceUpper?: string
    priceLower?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path: '/v5/alpha/lp/stake',
      signed: true,
      body: params,
    })
  }

  /**
   * Buy prediction outcome tokens with USDC
   * @see https://bybit-exchange.github.io/docs/v5/alpha/prediction/buy
   */
  async executePredictionBuy(params: {
    tokenId: string
    amount: string
    payTokenCode: string
    orderType: number
    slippage: string
    eventId: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path: '/v5/alpha/prediction/buy',
      signed: true,
      body: params,
    })
  }

  /**
   * Get prediction market matching engine availability status
   * @see https://bybit-exchange.github.io/docs/v5/alpha/prediction/engine-status
   */
  async getPredictionEngineStatus(): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path: '/v5/alpha/prediction/engine-status',
      signed: true,
    })
  }

  /**
   * Get prediction event detail with all markets and outcomes
   * @see https://bybit-exchange.github.io/docs/v5/alpha/prediction/event-detail
   */
  async getPredictionEventDetail(params: {
    eventId?: string
    slug?: string
    hasMoreMarkets?: boolean
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path: '/v5/alpha/prediction/event-detail',
      signed: true,
      body: params,
    })
  }

  /**
   * Get full order book snapshot for prediction tokens
   * @see https://bybit-exchange.github.io/docs/v5/alpha/prediction/order-book
   */
  async getPredictionOrderBook(params: {
    tokenIds: string[]
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path: '/v5/alpha/prediction/order-book',
      signed: true,
      body: params,
    })
  }

  /**
   * Estimate buy or sell order fill amount and fees before execution
   * @see https://bybit-exchange.github.io/docs/v5/alpha/prediction/order-estimate
   */
  async getPredictionOrderEstimate(params: {
    tokenId: string
    side: number
    eventId: string
    amount: string
    orderType: number
    payTokenCode?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path: '/v5/alpha/prediction/order-estimate',
      signed: true,
      body: params,
    })
  }

  /**
   * Get user's prediction market order history
   * @see https://bybit-exchange.github.io/docs/v5/alpha/prediction/order-list
   */
  async getPredictionOrderList(params: {
    status?: string
    tokenId?: string
    limit?: number
    pageIndex?: number
    eventId?: string
    side?: string
    days?: number
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path: '/v5/alpha/prediction/order-list',
      signed: true,
      body: params,
    })
  }

  /**
   * Get available payment tokens (USDC) for prediction market
   * @see https://bybit-exchange.github.io/docs/v5/alpha/prediction/pay-token-list
   */
  async getPredictionPayTokenList(): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path: '/v5/alpha/prediction/pay-token-list',
      signed: true,
    })
  }

  /**
   * Get user's prediction market portfolio overview
   * @see https://bybit-exchange.github.io/docs/v5/alpha/prediction/portfolio-summary
   */
  async getPredictionPortfolioSummary(params?: {
    eventType?: number
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path: '/v5/alpha/prediction/portfolio-summary',
      signed: true,
      body: params,
    })
  }

  /**
   * Get user's historical closed prediction market positions
   * @see https://bybit-exchange.github.io/docs/v5/alpha/prediction/position-history
   */
  async getPredictionPositionHistory(params: {
    tokenId?: string
    eventId?: string
    result?: number
    days?: number
    limit?: number
    pageIndex?: number
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path: '/v5/alpha/prediction/position-history',
      signed: true,
      body: params,
    })
  }

  /**
   * Get user's current open prediction market positions
   * @see https://bybit-exchange.github.io/docs/v5/alpha/prediction/position-list
   */
  async getPredictionPositionList(params: {
    tokenId?: string
    eventId?: string
    limit?: number
    pageIndex?: number
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path: '/v5/alpha/prediction/position-list',
      signed: true,
      body: params,
    })
  }

  /**
   * Get historical price chart data for prediction tokens
   * @see https://bybit-exchange.github.io/docs/v5/alpha/prediction/price-history
   */
  async getPredictionPriceHistory(params: {
    tokenId: string
    interval: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path: '/v5/alpha/prediction/price-history',
      signed: true,
      body: params,
    })
  }

  /**
   * Sell prediction outcome token shares for USDC
   * @see https://bybit-exchange.github.io/docs/v5/alpha/prediction/sell
   */
  async executePredictionSell(params: {
    tokenId: string
    size: string
    orderType: number
    slippage: string
    eventId: string
    toTokenCode?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path: '/v5/alpha/prediction/sell',
      signed: true,
      body: params,
    })
  }

  /**
   * Get related side markets for a sports event
   * @see https://bybit-exchange.github.io/docs/v5/alpha/prediction/side-market-list
   */
  async getPredictionSideMarketList(params: {
    eventId: string
    sortBy?: string
    marketType?: number
    limit?: number
    pageIndex?: number
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path: '/v5/alpha/prediction/side-market-list',
      signed: true,
      body: params,
    })
  }

  /**
   * Get group standings and results for a tournament stage
   * @see https://bybit-exchange.github.io/docs/v5/alpha/prediction/sports-group-stage-detail
   */
  async getPredictionGroupStageDetail(params: {
    eventType: string
    stageCode: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path: '/v5/alpha/prediction/sports/group-stage-detail',
      signed: true,
      body: params,
    })
  }

  /**
   * Get match list for a sports prediction event
   * @see https://bybit-exchange.github.io/docs/v5/alpha/prediction/sports-match-list
   */
  async getPredictionMatchList(params: {
    eventType: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path: '/v5/alpha/prediction/sports/match-list',
      signed: true,
      body: params,
    })
  }

  /**
   * Get tournament timeline stages for a sports event
   * @see https://bybit-exchange.github.io/docs/v5/alpha/prediction/sports-timeline-stages
   */
  async getPredictionTimelineStages(params: {
    eventType?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path: '/v5/alpha/prediction/sports/timeline-stages',
      signed: true,
      query: params,
    })
  }

  /**
   * Get real-time prices for prediction outcome tokens
   * @see https://bybit-exchange.github.io/docs/v5/alpha/prediction/token-price
   */
  async getPredictionTokenPrice(params: {
    tokenIds: string[]
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path: '/v5/alpha/prediction/token-price',
      signed: true,
      body: params,
    })
  }

  /**
   * Get holding details for a specific token including quantity, PnL, and cost basis
   * @see https://bybit-exchange.github.io/docs/v5/alpha/trade/asset-detail
   */
  async getAssetDetail(params: {
    chainCode: string
    tokenAddress: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path: '/v5/alpha/trade/asset-detail',
      signed: true,
      body: params,
    })
  }

  /**
   * Get user's on-chain token portfolio with holdings, PnL, and market value
   * @see https://bybit-exchange.github.io/docs/v5/alpha/trade/asset-list
   */
  async getAssetList(): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path: '/v5/alpha/trade/asset-list',
      signed: true,
    })
  }

  /**
   * Get token project details including description, social links, risk flag, and order limits
   * @see https://bybit-exchange.github.io/docs/v5/alpha/trade/biz-token-details
   */
  async getBizTokenDetails(params: {
    chainCode: string
    tokenAddress: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path: '/v5/alpha/trade/biz-token-details',
      signed: true,
      body: params,
    })
  }

  /**
   * Get on-chain tradable tokens with DEX token codes, risk flags, and order limits
   * @see https://bybit-exchange.github.io/docs/v5/alpha/trade/biz-token-list
   */
  async getBizTokenList(params: {
    tokenTag?: number
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path: '/v5/alpha/trade/biz-token-list',
      signed: true,
      body: params,
    })
  }

  /**
   * Batch query token prices, 24h change, volume, market cap, liquidity, and holders by chain+address
   * @see https://bybit-exchange.github.io/docs/v5/alpha/trade/biz-token-price-list
   */
  async getBizTokenPriceList(params: {
    tokenAddressInfo: Array<Record<string, unknown>>
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path: '/v5/alpha/trade/biz-token-price-list',
      signed: true,
      body: params,
    })
  }

  /**
   * Get trade order history with status, fees, and execution details
   * @see https://bybit-exchange.github.io/docs/v5/alpha/trade/order-list
   */
  async getOrderList(params: {
    tradeType?: number
    tokenCode?: string
    orderStatus?: Array<Record<string, unknown>>
    days?: number
    limit?: number
    pageIndex?: number
    direction?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path: '/v5/alpha/trade/order-list',
      signed: true,
      body: params,
    })
  }

  /**
   * Get available payment tokens (USDT, USDC, etc.) with CEX token codes and supported chains
   * @see https://bybit-exchange.github.io/docs/v5/alpha/trade/pay-token-list
   */
  async getPayTokenList(params: {
    chainCode: string
    tokenAddress: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path: '/v5/alpha/trade/pay-token-list',
      signed: true,
      body: params,
    })
  }

  /**
   * Execute a buy order to purchase on-chain tokens with USDT/USDC, returns order number
   * @see https://bybit-exchange.github.io/docs/v5/alpha/trade/trade-purchase
   */
  async executePurchase(params: {
    fromTokenCode: string
    fromTokenAmount: string
    toTokenCode: string
    slippage: string
    quoteData: string
    gas: string
    quoteMode: number
    correctingCode: string
    tenant?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path: '/v5/alpha/trade/purchase',
      signed: true,
      body: params,
    })
  }

  /**
   * Get estimated price, fees, slippage, and gas for an on-chain token trade
   * @see https://bybit-exchange.github.io/docs/v5/alpha/trade/trade-quote
   */
  async getTradeQuote(params: {
    tradeType: number
    fromTokenCode: string
    fromTokenAmount: string
    toTokenCode: string
    quoteMode?: number
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path: '/v5/alpha/trade/quote',
      signed: true,
      body: params,
    })
  }

  /**
   * Execute a sell order to redeem on-chain tokens for USDT/USDC, returns order number
   * @see https://bybit-exchange.github.io/docs/v5/alpha/trade/trade-redeem
   */
  async executeRedeem(params: {
    fromTokenCode: string
    fromTokenAmount: string
    toTokenCode: string
    slippage: string
    quoteData: string
    gas: string
    quoteMode: number
    correctingCode: string
    tenant?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path: '/v5/alpha/trade/redeem',
      signed: true,
      body: params,
    })
  }

}
