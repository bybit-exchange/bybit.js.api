import type { AxiosInstance } from 'axios'
import { requestJson } from '../http/request.js'
import type { ApiResponse , Category, Side, OrderType, TimeInForce, OrderStatus, AccountType } from '../types/common.js'
import type { CollateralItem } from '../types/nested.js'
import type { RestClientOptions } from '../config.js'

export class CryptoLoanService {
  constructor(
    protected readonly http: AxiosInstance,
    protected readonly opts: RestClientOptions,
  ) {}

  /**
   * Adjust Collateral (Add or Remove).
   */
  async adjustCollateral(params: {
    currency:  string
    amount:    string
    direction: number
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/crypto-loan-common/adjust-ltv',
      signed: true,
      body: {
        currency:  params.currency,
        amount:    params.amount,
        direction: params.direction,
      },
    })
  }

  /**
   * Calculate Max Borrowable Amount.
   */
  async calculateMaxBorrowableAmount(params: {
    currency:       string
    collateralList: CollateralItem[]
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/crypto-loan-common/max-loan',
      signed: true,
      body: {
        currency:       params.currency,
        collateralList: params.collateralList,
      },
    })
  }

  /**
   * Get Collateral Adjustment History.
   */
  async getCollateralAdjustmentHistory(params: {
    adjustId?:           number
    collateralCurrency?: string
    limit?:              number
    cursor?:             number
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/crypto-loan-common/adjustment-history',
      signed: true,
      query: {
        adjustId:           params.adjustId,
        collateralCurrency: params.collateralCurrency,
        limit:              params.limit,
        cursor:             params.cursor,
      },
    })
  }

  /**
   * Get Collateral Currency Data.
   */
  async getCollateralCurrencyData(params: {
    currency?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/crypto-loan-common/collateral-data',
      signed: false,
      query: {
        currency: params.currency,
      },
    })
  }

  /**
   * Get Crypto Loan Position.
   */
  async getLoanPosition(): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/crypto-loan-common/position',
      signed: true,
    })
  }

  /**
   * Get Loanable Currency Data.
   */
  async getLoanableCurrencyData(params: {
    currency?: string
    vipLevel?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/crypto-loan-common/loanable-data',
      signed: true,
      query: {
        currency: params.currency,
        vipLevel: params.vipLevel,
      },
    })
  }

  /**
   * Get Max Collateral Redeem Amount.
   */
  async getMaxCollateralRedeemAmount(params: {
    currency: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/crypto-loan-common/max-collateral-amount',
      signed: true,
      query: {
        currency: params.currency,
      },
    })
  }

  /**
   * Get borrow contract info for fixed-term crypto loans.
   */
  async getFixedBorrowContractInfo(params: {
    orderId?:       string
    loanId?:        string
    orderCurrency?: string
    term?:          string
    limit?:         number
    cursor?:        number
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/crypto-loan-fixed/borrow-contract-info',
      signed: true,
      query: {
        orderId:       params.orderId,
        loanId:        params.loanId,
        orderCurrency: params.orderCurrency,
        term:          params.term,
        limit:         params.limit,
        cursor:        params.cursor,
      },
    })
  }

  /**
   * Get borrow order info for fixed-term crypto loans.
   */
  async getFixedBorrowOrderInfo(params: {
    orderId?:       string
    orderCurrency?: string
    state?:         string
    term?:          string
    limit?:         number
    cursor?:        number
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/crypto-loan-fixed/borrow-order-info',
      signed: true,
      query: {
        orderId:       params.orderId,
        orderCurrency: params.orderCurrency,
        state:         params.state,
        term:          params.term,
        limit:         params.limit,
        cursor:        params.cursor,
      },
    })
  }

  /**
   * Get borrow market quotes for fixed-term crypto loans.
   */
  async getFixedBorrowOrderQuote(params: {
    orderCurrency?: string
    term?:          string
    orderBy?:       string
    sort?:          number
    limit?:         number
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/crypto-loan-fixed/borrow-order-quote',
      signed: false,
      query: {
        orderCurrency: params.orderCurrency,
        term:          params.term,
        orderBy:       params.orderBy,
        sort:          params.sort,
        limit:         params.limit,
      },
    })
  }

  /**
   * Get renewal information for fixed-term crypto loans.
   */
  async getFixedRenewInfo(params: {
    orderId?:       string
    orderCurrency?: string
    limit?:         number
    cursor?:        number
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/crypto-loan-fixed/renew-info',
      signed: true,
      query: {
        orderId:       params.orderId,
        orderCurrency: params.orderCurrency,
        limit:         params.limit,
        cursor:        params.cursor,
      },
    })
  }

  /**
   * Get repayment history for fixed-term crypto loans.
   */
  async getFixedRepaymentHistory(params: {
    repayId?:      string
    loanCurrency?: string
    limit?:        number
    cursor?:       number
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/crypto-loan-fixed/repayment-history',
      signed: true,
      query: {
        repayId:      params.repayId,
        loanCurrency: params.loanCurrency,
        limit:        params.limit,
        cursor:       params.cursor,
      },
    })
  }

  /**
   * Get supply contract info for fixed-term crypto loans.
   */
  async getFixedSupplyContractInfo(params: {
    orderId?:        string
    supplyId?:       string
    supplyCurrency?: string
    term?:           string
    limit?:          number
    cursor?:         number
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/crypto-loan-fixed/supply-contract-info',
      signed: true,
      query: {
        orderId:        params.orderId,
        supplyId:       params.supplyId,
        supplyCurrency: params.supplyCurrency,
        term:           params.term,
        limit:          params.limit,
        cursor:         params.cursor,
      },
    })
  }

  /**
   * Get supply order info for fixed-term crypto loans.
   */
  async getFixedSupplyOrderInfo(params: {
    orderId?:       string
    orderCurrency?: string
    state?:         string
    term?:          string
    limit?:         number
    cursor?:        number
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/crypto-loan-fixed/supply-order-info',
      signed: true,
      query: {
        orderId:       params.orderId,
        orderCurrency: params.orderCurrency,
        state:         params.state,
        term:          params.term,
        limit:         params.limit,
        cursor:        params.cursor,
      },
    })
  }

  /**
   * Get supply market quotes for fixed-term crypto loans.
   */
  async getFixedSupplyOrderQuote(params: {
    orderCurrency?: string
    term?:          string
    orderBy?:       string
    sort?:          number
    limit?:         number
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/crypto-loan-fixed/supply-order-quote',
      signed: false,
      query: {
        orderCurrency: params.orderCurrency,
        term:          params.term,
        orderBy:       params.orderBy,
        sort:          params.sort,
        limit:         params.limit,
      },
    })
  }

  /**
   * Create a fixed-term crypto loan borrow order.
   */
  async borrowFixed(params: {
    orderCurrency:  string
    orderAmount:    string
    annualRate:     string
    term:           string
    collateralList: CollateralItem[]
    autoRepay?:     string
    repayType?:     string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/crypto-loan-fixed/borrow',
      signed: true,
      body: {
        orderCurrency:  params.orderCurrency,
        orderAmount:    params.orderAmount,
        annualRate:     params.annualRate,
        term:           params.term,
        collateralList: params.collateralList,
        autoRepay:      params.autoRepay,
        repayType:      params.repayType,
      },
    })
  }

  /**
   * Cancel a fixed-term crypto loan borrow order.
   */
  async cancelFixedBorrowOrder(params: {
    orderId: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/crypto-loan-fixed/borrow-order-cancel',
      signed: true,
      body: {
        orderId: params.orderId,
      },
    })
  }

  /**
   * Fully repay a fixed-term crypto loan.
   */
  async repayFixedFull(params: {
    loanId:       string
    loanCurrency: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/crypto-loan-fixed/fully-repay',
      signed: true,
      body: {
        loanId:       params.loanId,
        loanCurrency: params.loanCurrency,
      },
    })
  }

  /**
   * Renew a fixed-term crypto loan.
   */
  async renewFixed(params: {
    loanId:         string
    collateralList: CollateralItem[]
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/crypto-loan-fixed/renew',
      signed: true,
      body: {
        loanId:         params.loanId,
        collateralList: params.collateralList,
      },
    })
  }

  /**
   * Repay a fixed-term crypto loan with collateral.
   */
  async repayFixedCollateral(params: {
    loanId:         number
    loanCurrency:   string
    collateralCoin: string
    amount:         string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/crypto-loan-fixed/repay-collateral',
      signed: true,
      body: {
        loanId:         params.loanId,
        loanCurrency:   params.loanCurrency,
        collateralCoin: params.collateralCoin,
        amount:         params.amount,
      },
    })
  }

  /**
   * Create a fixed-term crypto loan supply order.
   */
  async supplyFixed(params: {
    orderCurrency:    string
    orderAmount:      string
    annualRate:       string
    term:             string
    availableSource?: number
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/crypto-loan-fixed/supply',
      signed: true,
      body: {
        orderCurrency:    params.orderCurrency,
        orderAmount:      params.orderAmount,
        annualRate:       params.annualRate,
        term:             params.term,
        availableSource:  params.availableSource,
      },
    })
  }

  /**
   * Cancel a fixed-term crypto loan supply order.
   */
  async cancelFixedSupplyOrder(params: {
    orderId:          string
    refundedAccount?: number
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/crypto-loan-fixed/supply-order-cancel',
      signed: true,
      body: {
        orderId:         params.orderId,
        refundedAccount: params.refundedAccount,
      },
    })
  }

  /**
   * Get Flexible Borrow History
   */
  async getFlexibleBorrowHistory(params: {
    orderId?:      string
    loanCurrency?: string
    limit?:        number
    cursor?:       number
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/crypto-loan-flexible/borrow-history',
      signed: true,
      query: {
        orderId:      params.orderId,
        loanCurrency: params.loanCurrency,
        limit:        params.limit,
        cursor:       params.cursor,
      },
    })
  }

  /**
   * Get Ongoing Flexible Borrow Info
   */
  async getFlexibleOngoingCoin(params: {
    loanCurrency?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/crypto-loan-flexible/ongoing-coin',
      signed: true,
      query: {
        loanCurrency: params.loanCurrency,
      },
    })
  }

  /**
   * Get Flexible Repayment History
   */
  async getFlexibleRepaymentHistory(params: {
    repayId?:      string
    loanCurrency?: string
    limit?:        number
    cursor?:       number
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/crypto-loan-flexible/repayment-history',
      signed: true,
      query: {
        repayId:      params.repayId,
        loanCurrency: params.loanCurrency,
        limit:        params.limit,
        cursor:       params.cursor,
      },
    })
  }

  /**
   * Create Flexible Borrow Order
   */
  async borrowFlexible(params: {
    loanCurrency:   string
    loanAmount:     string
    collateralList: CollateralItem[]
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/crypto-loan-flexible/borrow',
      signed: true,
      body: {
        loanCurrency:   params.loanCurrency,
        loanAmount:     params.loanAmount,
        collateralList: params.collateralList,
      },
    })
  }

  /**
   * Repay Flexible Loan
   */
  async repayFlexible(params: {
    loanCurrency: string
    amount:       string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/crypto-loan-flexible/repay',
      signed: true,
      body: {
        loanCurrency: params.loanCurrency,
        amount:       params.amount,
      },
    })
  }

  /**
   * Repay with Collateral
   */
  async repayFlexibleCollateral(params: {
    loanCurrency:   string
    collateralCoin: string
    amount:         string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/crypto-loan-flexible/repay-collateral',
      signed: true,
      body: {
        loanCurrency:   params.loanCurrency,
        collateralCoin: params.collateralCoin,
        amount:         params.amount,
      },
    })
  }
}
