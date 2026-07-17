import type { AxiosInstance } from 'axios'
import { requestJson } from '../http/request.js'
import type { ApiResponse, Category, OrderType, AccountType } from '../types/common.js'
import type {
  CustomPlanProduct,
  DiscountBuyExtra,
  DoubleWinRedeemExtra,
  DoubleWinStakeExtra,
  DualAssetsExtra,
  InterestCardExtra,
  InvestmentDistributionItem,
  SmartLeverageRedeemExtra,
  SmartLeverageStakeExtra,
  UpdateFundItem,
} from '../types/nested.js'
import type { RestClientOptions } from '../config.js'

export class EarnService {
  constructor(
    protected readonly http: AxiosInstance,
    protected readonly opts: RestClientOptions,
  ) {}

  /**
   * Add liquidity to a Liquidity Mining product.
   */
  async addLiquidity(params: {
    productId:          string
    orderLinkId:        string
    quoteAccountType?:  string
    baseAccountType?:   string
    quoteAmount?:       string
    baseAmount?:        string
    leverage?:          string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/earn/liquidity-mining/add-liquidity',
      signed: true,
      body: {
        productId:         params.productId,
        orderLinkId:       params.orderLinkId,
        quoteAccountType:  params.quoteAccountType,
        baseAccountType:   params.baseAccountType,
        quoteAmount:       params.quoteAmount,
        baseAmount:        params.baseAmount,
        leverage:          params.leverage,
      },
    })
  }

  /**
   * Add margin to a Liquidity Mining position.
   */
  async addMargin(params: {
    productId:         string
    orderLinkId:       string
    positionId:        string
    amount:            string
    quoteAccountType:  string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/earn/liquidity-mining/add-margin',
      signed: true,
      body: {
        productId:         params.productId,
        orderLinkId:       params.orderLinkId,
        positionId:        params.positionId,
        amount:            params.amount,
        quoteAccountType:  params.quoteAccountType,
      },
    })
  }

  /**
   * Claim accrued interest from a Liquidity Mining product.
   */
  async claimLiquidityInterest(params: {
    productId: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/earn/liquidity-mining/claim-interest',
      signed: true,
      body: {
        productId: params.productId,
      },
    })
  }

  /**
   * Get advanced earn orders.
   */
  async getAdvanceEarnOrder(params: {
    category:      Category
    productId?:    number
    orderId?:      string
    orderLinkId?:  string
    startTime?:    number
    endTime?:      number
    limit?:        number
    cursor?:       string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/earn/advance/order',
      signed: true,
      query: {
        category:     params.category,
        productId:    params.productId,
        orderId:      params.orderId,
        orderLinkId:  params.orderLinkId,
        startTime:    params.startTime,
        endTime:      params.endTime,
        limit:        params.limit,
        cursor:       params.cursor,
      },
    })
  }

  /**
   * Get advanced earn positions.
   */
  async getAdvanceEarnPosition(params: {
    category:    Category
    productId?:  number
    coin?:       string
    limit?:      number
    cursor?:     string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/earn/advance/position',
      signed: true,
      query: {
        category:   params.category,
        productId:  params.productId,
        coin:       params.coin,
        limit:      params.limit,
        cursor:     params.cursor,
      },
    })
  }

  /**
   * Get advanced earn product info.
   */
  async getAdvanceEarnProduct(params: {
    category:   Category
    coin?:      string
    duration?:  string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/earn/advance/product',
      signed: false,
      query: {
        category:  params.category,
        coin:      params.coin,
        duration:  params.duration,
      },
    })
  }

  /**
   * Get extra info for an advanced earn product.
   */
  async getAdvanceEarnProductExtraInfo(params: {
    category:    Category
    productId?:  number
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/earn/advance/product-extra-info',
      signed: false,
      query: {
        category:   params.category,
        productId:  params.productId,
      },
    })
  }

  /**
   * Get double win leverage information.
   */
  async getDoubleWinLeverage(params: {
    productId:     number
    initialPrice:  string
    lowerPrice:    string
    upperPrice:    string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/earn/advance/double-win-leverage',
      signed: true,
      query: {
        productId:     params.productId,
        initialPrice:  params.initialPrice,
        lowerPrice:    params.lowerPrice,
        upperPrice:    params.upperPrice,
      },
    })
  }

  /**
   * Get APR history for an earn product.
   */
  async getEarnAprHistory(params: {
    category:   Category
    productId:  string
    startTime:  number
    endTime:    number
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/earn/apr-history',
      signed: false,
      query: {
        category:   params.category,
        productId:  params.productId,
        startTime:  params.startTime,
        endTime:    params.endTime,
      },
    })
  }

  /**
   * Get hourly earn yield history.
   */
  async getEarnHourlyYieldHistory(params: {
    category:    Category
    productId?:  string
    startTime?:  number
    endTime?:    number
    limit?:      number
    cursor?:     string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/earn/hourly-yield',
      signed: true,
      query: {
        category:   params.category,
        productId:  params.productId,
        startTime:  params.startTime,
        endTime:    params.endTime,
        limit:      params.limit,
        cursor:     params.cursor,
      },
    })
  }

  /**
   * Get stake or redeem order history.
   */
  async getEarnOrderHistory(params: {
    category:      Category
    orderId?:      string
    orderLinkId?:  string
    productId?:    string
    startTime?:    number
    endTime?:      number
    limit?:        number
    cursor?:       string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/earn/order',
      signed: true,
      query: {
        category:     params.category,
        orderId:      params.orderId,
        orderLinkId:  params.orderLinkId,
        productId:    params.productId,
        startTime:    params.startTime,
        endTime:      params.endTime,
        limit:        params.limit,
        cursor:       params.cursor,
      },
    })
  }

  /**
   * Get staked earn positions.
   */
  async getEarnPosition(params: {
    category:    Category
    productId?:  string
    coin?:       string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/earn/position',
      signed: true,
      query: {
        category:   params.category,
        productId:  params.productId,
        coin:       params.coin,
      },
    })
  }

  /**
   * Get earn product info.
   */
  async getEarnProduct(params: {
    category:  Category
    coin?:     string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/earn/product',
      signed: false,
      query: {
        category:  params.category,
        coin:      params.coin,
      },
    })
  }

  /**
   * Get earn yield history.
   */
  async getEarnYieldHistory(params: {
    category:    Category
    productId?:  number
    startTime?:  number
    endTime?:    number
    limit?:      number
    cursor?:     string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/earn/yield',
      signed: true,
      query: {
        category:   params.category,
        productId:  params.productId,
        startTime:  params.startTime,
        endTime:    params.endTime,
        limit:      params.limit,
        cursor:     params.cursor,
      },
    })
  }

  /**
   * Get Fixed Term Order History
   */
  async getFixedTermOrder(params?: {
    orderType?:  OrderType
    productId?:  string
    category?:   Category
    orderId?:    string
    startTime?:  number
    endTime?:    number
    limit?:      number
    cursor?:     string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/earn/fixed-term/order',
      signed: true,
      query: {
        orderType:  params?.orderType,
        productId:  params?.productId,
        category:   params?.category,
        orderId:    params?.orderId,
        startTime:  params?.startTime,
        endTime:    params?.endTime,
        limit:      params?.limit,
        cursor:     params?.cursor,
      },
    })
  }

  /**
   * Get Fixed Term Position
   */
  async getFixedTermPosition(params?: {
    productId?:  string
    category?:   Category
    coin?:       string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/earn/fixed-term/position',
      signed: true,
      query: {
        productId:  params?.productId,
        category:   params?.category,
        coin:       params?.coin,
      },
    })
  }

  /**
   * Get Fixed Term Product List
   */
  async getFixedTermProduct(params?: {
    coin?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/earn/fixed-term/product',
      signed: false,
      query: {
        coin: params?.coin,
      },
    })
  }

  /**
   * Get the list of Hold-to-Earn products.
   */
  async getHoldToEarnProduct(): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/earn/hold-to-earn/product',
      signed: false,
    })
  }

  /**
   * Get Hold-to-Earn yield history records with pagination.
   */
  async getHoldToEarnYieldHistory(params: {
    limit:       number
    timeStart?:  number
    timeEnd?:    number
    cursor?:     string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/earn/hold-to-earn/yield-history',
      signed: true,
      query: {
        limit:      params.limit,
        timeStart:  params.timeStart,
        timeEnd:    params.timeEnd,
        cursor:     params.cursor,
      },
    })
  }

  /**
   * Get liquidity mining liquidation records with optional filters by coin and time range.
   */
  async getLiquidityMiningLiquidationRecords(params?: {
    baseCoin?:   string
    quoteCoin?:  string
    startTime?:  number
    endTime?:    number
    limit?:      number
    cursor?:     string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/earn/liquidity-mining/liquidation-records',
      signed: true,
      query: {
        baseCoin:   params?.baseCoin,
        quoteCoin:  params?.quoteCoin,
        startTime:  params?.startTime,
        endTime:    params?.endTime,
        limit:      params?.limit,
        cursor:     params?.cursor,
      },
    })
  }

  /**
   * Get Liquidity Mining order history with optional filters and pagination.
   */
  async getLiquidityMiningOrders(params?: {
    orderId?:      string
    orderLinkId?:  string
    productId?:    string
    orderType?:    OrderType
    status?:       string
    startTime?:    number
    endTime?:      number
    limit?:        number
    cursor?:       string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/earn/liquidity-mining/order',
      signed: true,
      query: {
        orderId:      params?.orderId,
        orderLinkId:  params?.orderLinkId,
        productId:    params?.productId,
        orderType:    params?.orderType,
        status:       params?.status,
        startTime:    params?.startTime,
        endTime:      params?.endTime,
        limit:        params?.limit,
        cursor:       params?.cursor,
      },
    })
  }

  /**
   * Get active Liquidity Mining positions.
   */
  async getLiquidityMiningPositions(params?: {
    productId?:  string
    baseCoin?:   string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/earn/liquidity-mining/position',
      signed: true,
      query: {
        productId:  params?.productId,
        baseCoin:   params?.baseCoin,
      },
    })
  }

  /**
   * Get the list of Liquidity Mining products.
   */
  async getLiquidityMiningProducts(params?: {
    baseCoin?:   string
    quoteCoin?:  string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/earn/liquidity-mining/product',
      signed: false,
      query: {
        baseCoin:   params?.baseCoin,
        quoteCoin:  params?.quoteCoin,
      },
    })
  }

  /**
   * Get Liquidity Mining yield claim records with optional filters and pagination.
   */
  async getLiquidityMiningYieldRecords(params?: {
    baseCoin?:   string
    quoteCoin?:  string
    startTime?:  number
    endTime?:    number
    limit?:      number
    cursor?:     string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/earn/liquidity-mining/yield-records',
      signed: true,
      query: {
        baseCoin:   params?.baseCoin,
        quoteCoin:  params?.quoteCoin,
        startTime:  params?.startTime,
        endTime:    params?.endTime,
        limit:      params?.limit,
        cursor:     params?.cursor,
      },
    })
  }

  /**
   * Get NAV (Net Asset Value) chart data for an RWA product.
   */
  async getRwaNavChart(params: {
    productId:   number
    startTime?:  number
    endTime?:    number
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/earn/rwa/nav-chart',
      signed: false,
      query: {
        productId:  params.productId,
        startTime:  params.startTime,
        endTime:    params.endTime,
      },
    })
  }

  /**
   * Get the RWA order list with optional filters and pagination.
   */
  async getRwaOrderList(params?: {
    orderId?:      string
    orderLinkId?:  string
    orderType?:    OrderType
    productId?:    number
    startTime?:    number
    endTime?:      number
    limit?:        number
    cursor?:       string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/earn/rwa/order',
      signed: true,
      query: {
        orderId:      params?.orderId,
        orderLinkId:  params?.orderLinkId,
        orderType:    params?.orderType,
        productId:    params?.productId,
        startTime:    params?.startTime,
        endTime:      params?.endTime,
        limit:        params?.limit,
        cursor:       params?.cursor,
      },
    })
  }

  /**
   * Get the list of RWA positions.
   */
  async getRwaPositionList(): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/earn/rwa/position',
      signed: true,
    })
  }

  /**
   * Get Product List
   */
  async getRwaProductList(params?: {
    coin?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/earn/rwa/product',
      signed: false,
      query: {
        coin: params?.coin,
      },
    })
  }

  /**
   * Get smart leverage redeem estimation list.
   */
  async getSmartLeverageRedeemEstAmountList(params: {
    category:     Category
    positionIds:  string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/earn/advance/get-redeem-est-amount-list',
      signed: true,
      query: {
        category:     params.category,
        positionIds:  params.positionIds,
      },
    })
  }

  /**
   * Get Daily Yield
   */
  async getTokenDailyYield(params: {
    coin:        string
    startTime?:  number
    endTime?:    number
    cursor?:     string
    limit?:      number
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/earn/token/yield',
      signed: true,
      query: {
        coin:       params.coin,
        startTime:  params.startTime,
        endTime:    params.endTime,
        cursor:     params.cursor,
        limit:      params.limit,
      },
    })
  }

  /**
   * Get Historical APR
   */
  async getTokenHistoricalApr(params: {
    coin:   string
    range:  number
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/earn/token/history-apr',
      signed: false,
      query: {
        coin:   params.coin,
        range:  params.range,
      },
    })
  }

  /**
   * Get Hourly Yield
   */
  async getTokenHourlyYield(params: {
    coin:        string
    startTime?:  number
    endTime?:    number
    cursor?:     string
    limit?:      number
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/earn/token/hourly-yield',
      signed: true,
      query: {
        coin:       params.coin,
        startTime:  params.startTime,
        endTime:    params.endTime,
        cursor:     params.cursor,
        limit:      params.limit,
      },
    })
  }

  /**
   * Get Order List
   */
  async getTokenOrderList(params: {
    coin:          string
    orderLinkId?:  string
    orderId?:      string
    orderType?:    OrderType
    startTime?:    number
    endTime?:      number
    cursor?:       string
    limit?:        number
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/earn/token/order',
      signed: true,
      query: {
        coin:         params.coin,
        orderLinkId:  params.orderLinkId,
        orderId:      params.orderId,
        orderType:    params.orderType,
        startTime:    params.startTime,
        endTime:      params.endTime,
        cursor:       params.cursor,
        limit:        params.limit,
      },
    })
  }

  /**
   * Get Position
   */
  async getTokenPosition(params: {
    coin: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/earn/token/position',
      signed: true,
      query: {
        coin: params.coin,
      },
    })
  }

  /**
   * Get Product Info
   */
  async getTokenProduct(params: {
    coin: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/earn/token/product',
      signed: false,
      query: {
        coin: params.coin,
      },
    })
  }

  /**
   * List Coupons
   */
  async listEarnCoupons(params: {
    category: Category
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/earn/coupons',
      signed: true,
      query: {
        category: params.category,
      },
    })
  }

  /**
   * Modify an earn position (e.g. auto-reinvest).
   */
  async modifyEarnPosition(params: {
    category:      Category
    productId:     number
    positionId:    number
    autoReinvest:  number
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/earn/position/modify',
      signed: true,
      body: {
        category:      params.category,
        productId:     params.productId,
        positionId:    params.positionId,
        autoReinvest:  params.autoReinvest,
      },
    })
  }

  /**
   * Place an advanced earn order.
   */
  async placeAdvanceEarnOrder(params: {
    category:                   Category
    productId:                  number
    orderType:                  OrderType
    amount:                     string
    accountType:                AccountType
    coin:                       string
    orderLinkId:                string
    dualAssetsExtra?:           DualAssetsExtra
    interestCard?:              InterestCardExtra
    smartLeverageStakeExtra?:   SmartLeverageStakeExtra
    smartLeverageRedeemExtra?:  SmartLeverageRedeemExtra
    doubleWinStakeExtra?:       DoubleWinStakeExtra
    doubleWinRedeemExtra?:      DoubleWinRedeemExtra
    discountBuyExtra?:          DiscountBuyExtra
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/earn/advance/place-order',
      signed: true,
      body: {
        category:                  params.category,
        productId:                 params.productId,
        orderType:                 params.orderType,
        amount:                    params.amount,
        accountType:               params.accountType,
        coin:                      params.coin,
        orderLinkId:               params.orderLinkId,
        dualAssetsExtra:           params.dualAssetsExtra,
        interestCard:              params.interestCard,
        smartLeverageStakeExtra:   params.smartLeverageStakeExtra,
        smartLeverageRedeemExtra:  params.smartLeverageRedeemExtra,
        doubleWinStakeExtra:       params.doubleWinStakeExtra,
        doubleWinRedeemExtra:      params.doubleWinRedeemExtra,
        discountBuyExtra:          params.discountBuyExtra,
      },
    })
  }

  /**
   * Stake or redeem an earn product.
   */
  async placeEarnOrder(params: {
    category:           Category
    orderType:          OrderType
    accountType:        AccountType
    amount:             string
    coin:               string
    productId:          string
    orderLinkId:        string
    redeemPositionId?:  string
    toAccountType?:     string
    interestCard?:      InterestCardExtra
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/earn/place-order',
      signed: true,
      body: {
        category:          params.category,
        orderType:         params.orderType,
        accountType:       params.accountType,
        amount:            params.amount,
        coin:              params.coin,
        productId:         params.productId,
        orderLinkId:       params.orderLinkId,
        redeemPositionId:  params.redeemPositionId,
        toAccountType:     params.toAccountType,
        interestCard:      params.interestCard,
      },
    })
  }

  /**
   * Place Fixed Term Order
   */
  async placeFixedTermOrder(params: {
    productId:    string
    category:     Category
    coin:         string
    amount:       string
    accountType:  AccountType
    orderLinkId:  string
    autoInvest?:  boolean
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/earn/fixed-term/place-order',
      signed: true,
      body: {
        productId:    params.productId,
        category:     params.category,
        coin:         params.coin,
        amount:       params.amount,
        accountType:  params.accountType,
        orderLinkId:  params.orderLinkId,
        autoInvest:   params.autoInvest,
      },
    })
  }

  /**
   * Place a Real World Asset (RWA) stake or redeem order.
   */
  async placeRwaOrder(params: {
    productId:      number
    orderType:      OrderType
    coin:           string
    orderLinkId:    string
    stakeAmount?:   string
    redeemShares?:  string
    accountType?:   AccountType
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/earn/rwa/place-order',
      signed: true,
      body: {
        productId:     params.productId,
        orderType:     params.orderType,
        coin:          params.coin,
        orderLinkId:   params.orderLinkId,
        stakeAmount:   params.stakeAmount,
        redeemShares:  params.redeemShares,
        accountType:   params.accountType,
      },
    })
  }

  /**
   * Place Order (Mint/Redeem)
   */
  async placeTokenOrder(params: {
    coin:         string
    orderLinkId:  string
    orderType:    OrderType
    amount:       string
    accountType:  AccountType
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/earn/token/place-order',
      signed: true,
      body: {
        coin:         params.coin,
        orderLinkId:  params.orderLinkId,
        orderType:    params.orderType,
        amount:       params.amount,
        accountType:  params.accountType,
      },
    })
  }

  /**
   * Get Plan Asset Trend
   */
  async pwmAssetTrend(params: {
    planId:      string
    startTime?:  number
    endTime?:    number
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/earn/pwm/investment-plan/asset-trend',
      signed: true,
      query: {
        planId:     params.planId,
        startTime:  params.startTime,
        endTime:    params.endTime,
      },
    })
  }

  /**
   * Claim Available Funds
   */
  async pwmClaim(params: {
    planId:          string
    orderLinkId:     string
    toAccountType?:  string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/earn/pwm/investment-plan/claim',
      signed: true,
      body: {
        planId:         params.planId,
        orderLinkId:    params.orderLinkId,
        toAccountType:  params.toAccountType,
      },
    })
  }

  /**
   * Create Custom Investment Plan (Direct Mode)
   */
  async pwmCreateCustomPlan(params: {
    products:      CustomPlanProduct[]
    orderLinkId:   string
    accountType?:  AccountType
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/earn/pwm/customize-plan/create',
      signed: true,
      body: {
        products:     params.products,
        orderLinkId:  params.orderLinkId,
        accountType:  params.accountType,
      },
    })
  }

  /**
   * Get Fund Historical NAV
   */
  async pwmFundNav(params: {
    fundId:      string
    startTime?:  number
    endTime?:    number
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/earn/pwm/investment-plan/fund-nav',
      signed: true,
      query: {
        fundId:     params.fundId,
        startTime:  params.startTime,
        endTime:    params.endTime,
      },
    })
  }

  /**
   * Transfer funds between custody sub-accounts.
   */
  async pwmFundTransfer(params: {
    transferId:  string
    fromUserId:  number
    toUserId:    number
    amount:      string
    coin:        string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/earn/pwm/fund-transfer',
      signed: true,
      body: {
        transferId:  params.transferId,
        fromUserId:  params.fromUserId,
        toUserId:    params.toUserId,
        amount:      params.amount,
        coin:        params.coin,
      },
    })
  }

  /**
   * Get details of a pending-subscription investment plan.
   */
  async pwmGetNewPlanDetail(params: {
    planId: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/earn/pwm/investment-plan/new-plan',
      signed: true,
      query: {
        planId: params.planId,
      },
    })
  }

  /**
   * Get details of an active or closed investment plan.
   */
  async pwmGetPlanDetail(params: {
    planId: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/earn/pwm/investment-plan/detail',
      signed: true,
      query: {
        planId: params.planId,
      },
    })
  }

  /**
   * Create a pending-subscription fund under the institution's asset manager.
   */
  async pwmInstCreateFund(params: {
    fundName:           string
    coin:               string
    profitShareRate:    string
    managementFeeRate:  string
    reqLinkId:          string
    fundIntroduction?:  string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/earn/pwm/asset-manager/create-fund',
      signed: true,
      body: {
        fundName:           params.fundName,
        coin:               params.coin,
        profitShareRate:    params.profitShareRate,
        managementFeeRate:  params.managementFeeRate,
        reqLinkId:          params.reqLinkId,
        fundIntroduction:   params.fundIntroduction,
      },
    })
  }

  /**
   * Create an investment plan for a client under the institution's asset manager.
   */
  async pwmInstCreateInvestmentPlan(params: {
    accountUid:              string
    planName:                string
    planType:                string
    investmentDistribution:  InvestmentDistributionItem[]
    reqLinkId:               string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/earn/pwm/asset-manager/create-investment-plan',
      signed: true,
      body: {
        accountUid:              params.accountUid,
        planName:                params.planName,
        planType:                params.planType,
        investmentDistribution:  params.investmentDistribution,
        reqLinkId:               params.reqLinkId,
      },
    })
  }

  /**
   * Create a fund sub-account for the specified fund.
   */
  async pwmInstCreateSubAccount(params: {
    fundId:     string
    reqLinkId:  string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/earn/pwm/asset-manager/create-sub-account',
      signed: true,
      body: {
        fundId:     params.fundId,
        reqLinkId:  params.reqLinkId,
      },
    })
  }

  /**
   * Query institution's investment plans with optional filters.
   */
  async pwmInstGetInvestmentPlans(params?: {
    planId?:          string
    status?:          string
    subscriptionUid?: string
    limit?:           number
    cursor?:          string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/earn/pwm/asset-manager/get-investment-plan',
      signed: true,
      query: {
        planId:           params?.planId,
        status:           params?.status,
        subscriptionUid:  params?.subscriptionUid,
        limit:            params?.limit,
        cursor:           params?.cursor,
      },
    })
  }

  /**
   * Query institution's managed funds under the PWM asset manager.
   */
  async pwmInstListFunds(params?: {
    fundId?:  string
    coin?:    string
    status?:  string
    limit?:   number
    cursor?:  string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/earn/pwm/asset-manager/all-funds',
      signed: true,
      query: {
        fundId:  params?.fundId,
        coin:    params?.coin,
        status:  params?.status,
        limit:   params?.limit,
        cursor:  params?.cursor,
      },
    })
  }

  /**
   * Query fund subscription and redemption orders with optional filters.
   */
  async pwmInstListOrders(params?: {
    fundId?:     string
    orderType?:  OrderType
    status?:     string
    startTime?:  number
    endTime?:    number
    limit?:      number
    cursor?:     string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/earn/pwm/asset-manager/all-order',
      signed: true,
      query: {
        fundId:     params?.fundId,
        orderType:  params?.orderType,
        status:     params?.status,
        startTime:  params?.startTime,
        endTime:    params?.endTime,
        limit:      params?.limit,
        cursor:     params?.cursor,
      },
    })
  }

  /**
   * Update investment plan status and constituent funds.
   */
  async pwmInstManageInvestmentPlan(params: {
    planId:         string
    reqLinkId:      string
    updateStatus?:  string
    updateFunds?:   UpdateFundItem[]
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/earn/pwm/asset-manager/manage-investment-plan',
      signed: true,
      body: {
        planId:        params.planId,
        reqLinkId:     params.reqLinkId,
        updateStatus:  params.updateStatus,
        updateFunds:   params.updateFunds,
      },
    })
  }

  /**
   * Approve or reject a fund subscription or redemption order.
   */
  async pwmInstManageOrder(params: {
    orderId:    string
    action:     string
    reqLinkId:  string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/earn/pwm/asset-manager/manage-order',
      signed: true,
      body: {
        orderId:    params.orderId,
        action:     params.action,
        reqLinkId:  params.reqLinkId,
      },
    })
  }

  /**
   * Execute profit settlement for a specific fund.
   */
  async pwmInstSettleProfit(params: {
    fundId:     string
    reqLinkId:  string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/earn/pwm/asset-manager/settle-profit',
      signed: true,
      body: {
        fundId:     params.fundId,
        reqLinkId:  params.reqLinkId,
      },
    })
  }

  /**
   * Invest More in an Active Plan
   */
  async pwmInvestMore(params: {
    planId:        string
    category:      Category
    productId:     string
    amount:        string
    orderLinkId:   string
    accountType?:  AccountType
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/earn/pwm/investment-plan/invest-more',
      signed: true,
      body: {
        planId:       params.planId,
        category:     params.category,
        productId:    params.productId,
        amount:       params.amount,
        orderLinkId:  params.orderLinkId,
        accountType:  params.accountType,
      },
    })
  }

  /**
   * List all investment plans with optional filters.
   */
  async pwmListInvestmentPlans(params?: {
    planId?:  string
    status?:  string
    limit?:   number
    cursor?:  string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/earn/pwm/investment-plan/all',
      signed: true,
      query: {
        planId:  params?.planId,
        status:  params?.status,
        limit:   params?.limit,
        cursor:  params?.cursor,
      },
    })
  }

  /**
   * List Investment Plan Orders
   */
  async pwmListOrder(params?: {
    planId?:       string
    category?:     Category
    type?:         string
    status?:       string
    startTime?:    number
    endTime?:      number
    limit?:        number
    cursor?:       string
    orderLinkId?:  string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/earn/pwm/investment-plan/order',
      signed: true,
      query: {
        planId:       params?.planId,
        category:     params?.category,
        type:         params?.type,
        status:       params?.status,
        startTime:    params?.startTime,
        endTime:      params?.endTime,
        limit:        params?.limit,
        cursor:       params?.cursor,
        orderLinkId:  params?.orderLinkId,
      },
    })
  }

  /**
   * List Available Product Cards (Direct Mode)
   */
  async pwmListProductCards(): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/earn/pwm/customize-plan/product',
      signed: false,
    })
  }

  /**
   * Query fund transfer records by transfer ID or source user.
   */
  async pwmQueryFundTransferResult(params?: {
    transferId?:  string
    fromUserId?:  number
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/earn/pwm/query-fund-transfer-result',
      signed: true,
      query: {
        transferId:  params?.transferId,
        fromUserId:  params?.fromUserId,
      },
    })
  }

  /**
   * Redeem from an Investment Plan
   */
  async pwmRedeem(params: {
    planId:       string
    category:     Category
    productId:    string
    orderLinkId:  string
    shares?:      string
    amount?:      string
    positionId?:  number
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/earn/pwm/investment-plan/redeem',
      signed: true,
      body: {
        planId:       params.planId,
        category:     params.category,
        productId:    params.productId,
        orderLinkId:  params.orderLinkId,
        shares:       params.shares,
        amount:       params.amount,
        positionId:   params.positionId,
      },
    })
  }

  /**
   * One-Click Subscribe to Pending Plan
   */
  async pwmSubscribe(params: {
    planId:        string
    orderLinkId:   string
    accountType?:  AccountType
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/earn/pwm/investment-plan/subscribe',
      signed: true,
      body: {
        planId:       params.planId,
        orderLinkId:  params.orderLinkId,
        accountType:  params.accountType,
      },
    })
  }

  /**
   * Redeem Fixed Term Position
   */
  async redeemFixedTerm(params: {
    productId:   string
    category:    Category
    positionId:  string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/earn/fixed-term/redeem',
      signed: true,
      body: {
        productId:   params.productId,
        category:    params.category,
        positionId:  params.positionId,
      },
    })
  }

  /**
   * Reinvest accrued interest from a Liquidity Mining position.
   */
  async reinvestLiquidity(params: {
    productId:    string
    orderLinkId:  string
    positionId:   string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/earn/liquidity-mining/reinvest',
      signed: true,
      body: {
        productId:    params.productId,
        orderLinkId:  params.orderLinkId,
        positionId:   params.positionId,
      },
    })
  }

  /**
   * Remove liquidity from a Liquidity Mining position.
   */
  async removeLiquidity(params: {
    productId:    string
    orderLinkId:  string
    positionId:   string
    removeRate?:  number
    removeType?:  string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/earn/liquidity-mining/remove-liquidity',
      signed: true,
      body: {
        productId:    params.productId,
        orderLinkId:  params.orderLinkId,
        positionId:   params.positionId,
        removeRate:   params.removeRate,
        removeType:   params.removeType,
      },
    })
  }

  /**
   * Set Auto-Invest
   */
  async setFixedTermAutoInvest(params: {
    productId:   string
    category:    Category
    positionId:  string
    status:      string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/earn/fixed-term/position/auto-invest',
      signed: true,
      body: {
        productId:   params.productId,
        category:    params.category,
        positionId:  params.positionId,
        status:      params.status,
      },
    })
  }
}
