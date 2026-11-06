import type { AxiosInstance } from 'axios'
import { requestJson } from '../http/request.js'
import type { ApiResponse } from '../types/common.js'
import type { RestClientOptions } from '../config.js'

export class PreUpgradeService {
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
   * Get Pre-upgrade Transaction Log
   * @see https://bybit-exchange.github.io/docs/v5/pre-upgrade/transaction-log
   */
  async getTransactionLog(params: {
    category: 'linear' | 'option'
    baseCoin?: string
    type?:
      | 'TRADE'
      | 'SETTLEMENT'
      | 'DELIVERY'
      | 'LIQUIDATION'
      | 'PART_LIQUIDATION'
      | 'ADL'
      | 'CLOSEPNL'
      | 'POSITION_TAKE_OVER'
      | 'TRANSFER_IN'
      | 'TRANSFER_OUT'
      | 'INSURANCE_FUND'
      | 'FEE_REFUND'
      | 'INTEREST'
      | 'FIXED_INTEREST'
      | 'FIXED_INTEREST_REFUND'
      | 'BONUS'
      | 'BONUS_RECOLLECT'
      | 'BONUS_TRANSFER_IN'
      | 'BONUS_TRANSFER_OUT'
      | 'AIRDROP'
      | 'AIRDROP_OUT'
      | 'AIRDROP_EFTD'
      | 'AIRDROP_OUT_EFTD'
      | 'AIRDROP_FIAT'
      | 'AIRDROP_OUT_FIAT'
      | 'OTC_TRADE'
      | 'CURRENCY_BUY'
      | 'CURRENCY_SELL'
      | 'CURRENCY_BUY_MANUEL'
      | 'CURRENCY_SELL_MANUEL'
      | 'AUTO_DEDUCTION'
      | 'PERP_SYMBOL_SETTLE'
      | 'SPREAD_FEE_OUT'
      | 'MANUAL_LOANS_BORROW'
      | 'MANUAL_LOANS_REPAY'
      | 'AUTO_LOANS_BORROW'
      | 'AUTO_LOANS_REPAY'
      | 'SPOT_REPAYMENT_BUY'
      | 'SPOT_REPAYMENT_SELL'
      | 'LOANS_ASSET_REDEMPTION'
      | 'LOANS_PLEDGE_ASSET'
      | 'LOANS_BORROW_FUNDS'
      | 'LOANS_REPAY_FUNDS'
      | 'INSTITUTION_LOAN_IN'
      | 'INSTITUTION_PAYBACK_PRINCIPAL_OUT'
      | 'INSTITUTION_PAYBACK_INTEREST_OUT'
      | 'INSTITUTION_EXCHANGE_SELL'
      | 'INSTITUTION_EXCHANGE_BUY'
      | 'INSTITUTION_LIQ_PRINCIPAL_OUT'
      | 'INSTITUTION_LIQ_INTEREST_OUT'
      | 'INSTITUTION_LOAN_TRANSFER_IN'
      | 'INSTITUTION_LOAN_TRANSFER_OUT'
      | 'INSTITUTION_LOAN_WITHOUT_WITHDRAW'
      | 'INSTITUTION_LOAN_RESERVE_IN'
      | 'INSTITUTION_LOAN_RESERVE_OUT'
      | 'PREMARKET_TRANSFER_IN'
      | 'PREMARKET_TRANSFER_OUT'
      | 'PREMARKET_DELIVERY_SELL_NEW_COIN'
      | 'PREMARKET_DELIVERY_BUY_NEW_COIN'
      | 'PREMARKET_DELIVERY_PLEDGE_PAY_SELLER'
      | 'PREMARKET_DELIVERY_PLEDGE_BACK'
      | 'PREMARKET_ROLLBACK_PLEDGE_BACK'
      | 'PREMARKET_ROLLBACK_PLEDGE_PENALTY_TO_BUYER'
      | 'TOKENS_SUBSCRIPTION'
      | 'TOKENS_REDEMPTION'
      | 'FLEXIBLE_STAKING_SUBSCRIPTION'
      | 'FLEXIBLE_STAKING_REDEMPTION'
      | 'FLEXIBLE_STAKING_REFUND'
      | 'FIXED_STAKING_SUBSCRIPTION'
      | 'FIXED_STAKING_REFUND'
      | 'ONCHAINEARN_SUBSCRIPTION'
      | 'ONCHAINEARN_REFUND'
      | 'ONCHAINEARN_REDEMPTION'
      | 'ONCHAINEARN_REDEMPTION_PRINCIPAL'
      | 'ONCHAINEARN_LST'
      | 'DEFI_INVESTMENT_SUBSCRIPTION'
      | 'DEFI_INVESTMENT_REFUND'
      | 'DEFI_INVESTMENT_REDEMPTION'
      | 'STRUCTURE_PRODUCT_SUBSCRIPTION'
      | 'STRUCTURE_PRODUCT_REFUND'
      | 'CLASSIC_WEALTH_MANAGEMENT_SUBSCRIPTION'
      | 'PREMIUM_WEALTH_MANAGEMENT_SUBSCRIPTION'
      | 'PREMIUM_WEALTH_MANAGEMENT_REFUND'
      | 'LIQUIDITY_MINING_SUBSCRIPTION'
      | 'LIQUIDITY_MINING_REFUND'
      | 'PWM_SUBSCRIPTION'
      | 'PWM_REFUND'
      | 'CUSTODY_LOCK'
      | 'CUSTODY_UNLOCK'
      | 'CUSTODY_UNLOCK_REFUND'
      | 'CUSTODY_NETWORK_FEE'
      | 'CUSTODY_SETTLE_FEE'
      | 'PLATFORM_TOKEN_MNT_LIQRECALLEDMMNT'
      | 'PLATFORM_TOKEN_MNT_LIQRETURNEDMNT'
      | 'PEF_TRANSFER_IN'
      | 'PEF_TRANSFER_OUT'
      | 'PEF_PROFIT_SHARE'
    startTime?: number
    endTime?: number
    limit?: number
    cursor?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path: '/v5/pre-upgrade/account/transaction-log',
      signed: true,
      query: params,
    })
  }

  /** @deprecated Use `getTransactionLog` instead. */
  async getTransactionLogGet(
    params: Parameters<PreUpgradeService['getTransactionLog']>[0],
  ): Promise<ApiResponse<unknown>> {
    return this.getTransactionLog(params)
  }

  /**
   * Get Pre-upgrade Delivery Record
   * @see https://bybit-exchange.github.io/docs/v5/pre-upgrade/delivery
   */
  async getDeliveryRecord(params: {
    category: 'option'
    symbol?: string
    expDate?: string
    limit?: number
    cursor?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path: '/v5/pre-upgrade/asset/delivery-record',
      signed: true,
      query: params,
    })
  }

  /** @deprecated Use `getDeliveryRecord` instead. */
  async getDeliveryRecordGet(
    params: Parameters<PreUpgradeService['getDeliveryRecord']>[0],
  ): Promise<ApiResponse<unknown>> {
    return this.getDeliveryRecord(params)
  }

  /**
   * Get Pre-upgrade Settlement Record
   * @see https://bybit-exchange.github.io/docs/v5/pre-upgrade/settlement
   */
  async getSettlementRecord(params: {
    category: 'linear'
    symbol?: string
    limit?: number
    cursor?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path: '/v5/pre-upgrade/asset/settlement-record',
      signed: true,
      query: params,
    })
  }

  /**
   * Get Pre-Upgrade Closed PnL
   * @see https://bybit-exchange.github.io/docs/v5/pre-upgrade/close-pnl
   */
  async getClosedPnl(params: {
    category: 'linear' | 'inverse'
    symbol: string
    startTime?: number
    endTime?: number
    limit?: number
    cursor?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path: '/v5/pre-upgrade/position/closed-pnl',
      signed: true,
      query: params,
    })
  }

  /** @deprecated Use `getClosedPnl` instead. */
  async getClosedPnlGet(
    params: Parameters<PreUpgradeService['getClosedPnl']>[0],
  ): Promise<ApiResponse<unknown>> {
    return this.getClosedPnl(params)
  }

  /**
   * Get Pre-upgrade Execution List
   * @see https://bybit-exchange.github.io/docs/v5/pre-upgrade/execution
   */
  async getExecutionList(params: {
    category: 'linear' | 'inverse' | 'option' | 'spot'
    symbol?: string
    orderId?: string
    orderLinkId?: string
    baseCoin?: string
    startTime?: number
    endTime?: number
    execType?:
      | 'Trade'
      | 'AdlTrade'
      | 'Funding'
      | 'BustTrade'
      | 'Delivery'
      | 'Settle'
      | 'BlockTrade'
      | 'MovePosition'
      | 'FutureSpread'
      | 'UNKNOWN'
    limit?: number
    cursor?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path: '/v5/pre-upgrade/execution/list',
      signed: true,
      query: params,
    })
  }

  /**
   * Get Pre-upgrade Order History
   * @see https://bybit-exchange.github.io/docs/v5/pre-upgrade/order-list
   */
  async getOrderHistory(params: {
    category: 'linear' | 'inverse' | 'option' | 'spot'
    symbol?: string
    baseCoin?: string
    orderId?: string
    orderLinkId?: string
    orderFilter?: 'Order' | 'StopOrder'
    orderStatus?: string
    startTime?: number
    endTime?: number
    limit?: number
    cursor?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path: '/v5/pre-upgrade/order/history',
      signed: true,
      query: params,
    })
  }

  /** @deprecated Use `getOrderHistory` instead. */
  async getOrderHistoryGet(
    params: Parameters<PreUpgradeService['getOrderHistory']>[0],
  ): Promise<ApiResponse<unknown>> {
    return this.getOrderHistory(params)
  }
}
