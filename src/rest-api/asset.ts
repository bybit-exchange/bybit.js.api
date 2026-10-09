import type { AxiosInstance } from 'axios'
import { requestJson } from '../http/request.js'
import type { AccountType, ApiResponse, Category } from '../types/common.js'
import type { RestClientOptions } from '../config.js'

export class AssetService {
  constructor(
    protected readonly http: AxiosInstance,
    protected readonly opts: RestClientOptions,
  ) {}

  /**
   * Get coin balances for an account type (optionally filtered by coin / sub-member).
   * Returns totalEquity + per-coin breakdown.
   * @see https://bybit-exchange.github.io/docs/v5/asset/balance/all-balance
   */
  async getAllCoinsBalance(params: {
    accountType: AccountType
    memberId?:   string
    coin?:       string
    withBonus?:  number
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/asset/transfer/query-account-coins-balance',
      signed: true,
      query: {
        accountType: params.accountType,
        memberId:    params.memberId,
        coin:        params.coin,
        withBonus:   params.withBonus,
      },
    })
  }

  /**
   * Get single-coin balance for an account type.
   * @see https://bybit-exchange.github.io/docs/v5/asset/balance/account-coin-balance
   */
  async getSingleCoinBalance(params: {
    accountType: AccountType
    coin:        string
    memberId?:   string
    withBonus?:  number
    withTransferSafeAmount?: number
    withLdBalance?:          number
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/asset/transfer/query-account-coin-balance',
      signed: true,
      query: {
        accountType: params.accountType,
        coin:        params.coin,
        memberId:    params.memberId,
        withBonus:   params.withBonus,
        withTransferSafeAmount: params.withTransferSafeAmount,
        withLdBalance:          params.withLdBalance,
      },
    })
  }

  /**
   * Get Coin Greeks for USDC options.
   * @see https://bybit-exchange.github.io/docs/v5/asset/coin-greeks
   */
  async getCoinGreeks(params: {
    baseCoin?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/asset/coin-greeks',
      signed: true,
      query: {
        baseCoin: params.baseCoin,
      },
    })
  }

  /**
   * Get Coin Info — chain metadata (deposit / withdraw enabled, min amounts, fees).
   * @see https://bybit-exchange.github.io/docs/v5/asset/coin-info
   */
  async getCoinInfo(params: {
    coin?: string
  } = {}): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/asset/coin/query-info',
      signed: true,
      query: {
        coin: params.coin,
      },
    })
  }

  /**
   * Get Funding history (option contracts).
   * @see https://bybit-exchange.github.io/docs/v5/asset/funding
   */
  async getFundingDetail(params: {
    createTimeFrom?: string
    createTimeTo?:   string
    limit?:          number
    cursor?:         string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/asset/fundinghistory',
      signed: true,
      query: {
        createTimeFrom: params.createTimeFrom,
        createTimeTo:   params.createTimeTo,
        limit:          params.limit,
        cursor:         params.cursor,
      },
    })
  }

  /**
   * Get Asset Info by account type.
   * @see https://bybit-exchange.github.io/docs/v5/asset/asset-info
   */
  async getAssetInfo(params: {
    accountType: AccountType
    coin?:       string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/asset/transfer/query-asset-info',
      signed: true,
      query: {
        accountType: params.accountType,
        coin:        params.coin,
      },
    })
  }

  /**
   * Get Deposit Records (master).
   * @see https://bybit-exchange.github.io/docs/v5/asset/deposit/deposit-record
   */
  async getDepositRecords(params: {
    coin?:      string
    startTime?: number
    endTime?:   number
    cursor?:    string
    limit?:     number
  } = {}): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/asset/deposit/query-record',
      signed: true,
      query:  params,
    })
  }

  /**
   * Get Sub-account Deposit Records.
   * @see https://bybit-exchange.github.io/docs/v5/asset/deposit/sub-deposit-record
   */
  async getSubDepositRecords(params: {
    subMemberId: string
    coin?:      string
    startTime?: number
    endTime?:   number
    cursor?:    string
    limit?:     number
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/asset/deposit/query-sub-member-record',
      signed: true,
      query:  params,
    })
  }

  /**
   * Get Internal Deposit Records (in-platform transfers received).
   * @see https://bybit-exchange.github.io/docs/v5/asset/deposit/internal-deposit-record
   */
  async getInternalDepositRecords(params: {
    txID?:      string
    startTime?: number
    endTime?:   number
    coin?:      string
    cursor?:    string
    limit?:     number
  } = {}): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/asset/deposit/query-internal-record',
      signed: true,
      query:  params,
    })
  }

  /**
   * Get Master Deposit Address for a coin (with optional chain filter).
   * @see https://bybit-exchange.github.io/docs/v5/asset/deposit/master-deposit-addr
   */
  async getDepositAddress(params: {
    coin:       string
    chainType?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/asset/deposit/query-address',
      signed: true,
      query:  params,
    })
  }

  /**
   * Get Sub-account Deposit Address.
   * @see https://bybit-exchange.github.io/docs/v5/asset/deposit/sub-deposit-addr
   */
  async getSubDepositAddress(params: {
    subMemberId: string
    coin:        string
    chainType:   string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/asset/deposit/query-sub-member-address',
      signed: true,
      query:  params,
    })
  }

  /**
   * Get Withdraw Records.
   * @see https://bybit-exchange.github.io/docs/v5/asset/withdraw/withdraw-record
   */
  async getWithdrawRecords(params: {
    withdrawID?:   string
    coin?:         string
    withdrawType?: number
    startTime?:    number
    endTime?:      number
    cursor?:       string
    limit?:        number
  } = {}): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/asset/withdraw/query-record',
      signed: true,
      query:  params,
    })
  }

  /**
   * Get Withdrawable Amount for a coin (per chain).
   * @see https://bybit-exchange.github.io/docs/v5/asset/withdraw/withdrawable-amount
   */
  async getWithdrawableAmount(params: {
    coin: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/asset/withdraw/withdrawable-amount',
      signed: true,
      query:  params,
    })
  }

  /**
   * Submit a Withdrawal (on-chain or internal). Requires withdraw permission on the API key.
   * @see https://bybit-exchange.github.io/docs/v5/asset/withdraw/create-withdraw
   */
  async createWithdrawal(params: {
    coin:        string
    chain?:      string
    address:     string
    tag?:        string
    amount:      string
    timestamp:   number
    forceChain?: number
    accountType?: AccountType
    feeType?:    number
    requestId?:  string
    beneficiary?: Record<string, unknown>
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/asset/withdraw/create',
      signed: true,
      body:   params,
    })
  }

  /**
   * Cancel a pending withdrawal by ID.
   * @see https://bybit-exchange.github.io/docs/v5/asset/withdraw/cancel-withdraw
   */
  async cancelWithdrawal(params: {
    id: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/asset/withdraw/cancel',
      signed: true,
      body:   params,
    })
  }

  /**
   * List coins that can be transferred between accounts.
   * @see https://bybit-exchange.github.io/docs/v5/asset/transfer/transferable-coin
   */
  async getTransferableCoin(params: {
    fromAccountType: AccountType
    toAccountType:   AccountType
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/asset/transfer/query-transfer-coin-list',
      signed: true,
      query:  params,
    })
  }

  /**
   * Create an Internal Transfer between the caller's own account types.
   * @see https://bybit-exchange.github.io/docs/v5/asset/transfer/create-inter-transfer
   */
  async createInternalTransfer(params: {
    transferId:      string
    coin:            string
    amount:          string
    fromAccountType: AccountType
    toAccountType:   AccountType
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/asset/transfer/inter-transfer',
      signed: true,
      body:   params,
    })
  }

  /**
   * Get Internal Transfer Records.
   * @see https://bybit-exchange.github.io/docs/v5/asset/transfer/inter-transfer-list
   */
  async getInternalTransferRecords(params: {
    transferId?: string
    coin?:       string
    status?:     string
    startTime?:  number
    endTime?:    number
    limit?:      number
    cursor?:     string
  } = {}): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/asset/transfer/query-inter-transfer-list',
      signed: true,
      query:  params,
    })
  }

  /**
   * Create a Universal Transfer — between master and sub UIDs (up to 100 sub-UIDs per master).
   * @see https://bybit-exchange.github.io/docs/v5/asset/transfer/create-univ-transfer
   */
  async createUniversalTransfer(params: {
    transferId:      string
    coin:            string
    amount:          string
    fromMemberId:    number
    toMemberId:      number
    fromAccountType: AccountType
    toAccountType:   AccountType
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/asset/transfer/universal-transfer',
      signed: true,
      body:   params,
    })
  }

  /**
   * Get Universal Transfer Records.
   * @see https://bybit-exchange.github.io/docs/v5/asset/transfer/unitransfer-list
   */
  async getUniversalTransferRecords(params: {
    transferId?: string
    coin?:       string
    status?:     string
    startTime?:  number
    endTime?:    number
    limit?:      number
    cursor?:     string
  } = {}): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/asset/transfer/query-universal-transfer-list',
      signed: true,
      query:  params,
    })
  }

  /**
   * Get Sub-UID list (available for universal transfer).
   * @see https://bybit-exchange.github.io/docs/v5/asset/transfer/sub-uid-list
   */
  async getSubUidList(): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/asset/transfer/query-sub-member-list',
      signed: true,
    })
  }

  /**
   * Get Exchange-order Coin records (spot/futures).
   * @see https://bybit-exchange.github.io/docs/v5/asset/exchange
   */
  async getExchangeCoinRecords(params: {
    fromCoin?:  string
    toCoin?:    string
    limit?:     number
    cursor?:    string
  } = {}): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/asset/exchange/order-record',
      signed: true,
      query:  params,
    })
  }

  /**
   * Get Delivery record (option contracts).
   * @see https://bybit-exchange.github.io/docs/v5/asset/delivery
   */
  async getDeliveryRecord(params: {
    category:   Category
    symbol?:    string
    expDate?:   string
    limit?:     number
    cursor?:    string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/asset/delivery-record',
      signed: true,
      query:  params,
    })
  }

  /**
   * Get USDC Session Settlement records (unified account only).
   * @see https://bybit-exchange.github.io/docs/v5/asset/settlement
   */
  async getSessionSettlement(params: {
    category:   Category
    symbol?:    string
    limit?:     number
    cursor?:    string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/asset/settlement-record',
      signed: true,
      query:  params,
    })
  }

  // ---------- Convert (Bybit v5 /v5/asset/exchange/*) ----------

  /**
   * Request a convert quote.
   * @see https://bybit-exchange.github.io/docs/v5/asset/convert/apply-quote
   */
  async requestConvertQuote(params: {
    fromCoin:        string
    toCoin:          string
    requestCoin:     string
    requestAmount:   string
    accountType:     AccountType
    fromCoinType?:   string
    toCoinType?:     string
    paramType?:      string
    paramValue?:     string
    requestId?:      string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/asset/exchange/quote-apply',
      signed: true,
      body:   params,
    })
  }

  /**
   * Confirm a convert quote — locks in the exchange.
   * @see https://bybit-exchange.github.io/docs/v5/asset/convert/confirm-quote
   */
  async confirmConvertQuote(params: {
    quoteTxId: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/asset/exchange/convert-execute',
      signed: true,
      body:   params,
    })
  }

  /**
   * Get one convert result by quoteTxId.
   * @see https://bybit-exchange.github.io/docs/v5/asset/convert/get-convert-result
   */
  async getConvertResult(params: {
    quoteTxId:   string
    accountType: AccountType
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/asset/exchange/convert-result-query',
      signed: true,
      query:  params,
    })
  }

  /**
   * List convert history for an account type.
   * @see https://bybit-exchange.github.io/docs/v5/asset/convert/convert-history
   */
  async listConvertHistory(params: {
    accountType: AccountType
    index?:      number
    limit?:      number
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/asset/exchange/query-convert-history',
      signed: true,
      query:  params,
    })
  }

  /**
   * List convertible coins from a given account type.
   * @see https://bybit-exchange.github.io/docs/v5/asset/convert/convert-coin-list
   */
  async listConvertCoins(params: {
    accountType: AccountType
    coin?:       string
    side?:       number
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/asset/exchange/query-coin-list',
      signed: true,
      query:  params,
    })
  }

  /**
   * Get Asset Overview
   * @see https://bybit-exchange.github.io/docs/v5/asset/balance/asset-overview
   */
  async getOverview(params: {
    accountType?: string
    memberId?: string
    valuationCurrency?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path: '/v5/asset/asset-overview',
      signed: true,
      query: params,
    })
  }

  /**
   * Small asset get quote
   * @see https://bybit-exchange.github.io/docs/v5/asset/convert-small-balance/request-quote
   */
  async smallAssetQuote(params: {
    accountType: string
    toCoin: string
    fromCoinList: Array<Record<string, unknown>>
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path: '/v5/asset/covert/get-quote',
      signed: true,
      body: params,
    })
  }

  /**
   * Small asset confirm conversion
   * @see https://bybit-exchange.github.io/docs/v5/asset/convert-small-balance/confirm-quote
   */
  async smallAssetConvert(params: {
    quoteId: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path: '/v5/asset/covert/small-balance-execute',
      signed: true,
      body: params,
    })
  }

  /**
   * Small asset conversion history query
   * @see https://bybit-exchange.github.io/docs/v5/asset/convert-small-balance/exchange-history
   */
  async getSmallAssetConvertOrder(params: {
    accountType?: string
    quoteId?: string
    cursor?: string
    size?: string
    startTime?: string
    endTime?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path: '/v5/asset/covert/small-balance-history',
      signed: true,
      query: params,
    })
  }

  /**
   * Small asset conversion list query
   * @see https://bybit-exchange.github.io/docs/v5/asset/convert-small-balance/small-balanc-coins
   */
  async getSmallAssetList(params: {
    accountType: string
    fromCoin?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path: '/v5/asset/covert/small-balance-list',
      signed: true,
      query: params,
    })
  }

  /**
   * Set Deposit Account
   * @see https://bybit-exchange.github.io/docs/v5/asset/deposit/set-deposit-acct
   */
  async setDefaultDepositToAccount(params: {
    accountType: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path: '/v5/asset/deposit/deposit-to-account',
      signed: true,
      body: params,
    })
  }

  /**
   * Limit order callback notification
   */
  async limitOrderCallback(params: {
    exchangeTxId: string
    optionType: number
    errorCode?: string
    timeStamp: number
    sign: string
    appId: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path: '/v5/asset/exchange/limit-order/callback',
      signed: true,
      body: params,
    })
  }

  /**
   * Query coin conversion limit
   */
  async coinConvertLimitQuery(params: {
    fromCoin: string
    fromCoinType?: number
    toCoin: string
    toCoinType?: number
    accountType: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path: '/v5/asset/exchange/query-convert-limit',
      signed: true,
      query: params,
    })
  }

  /**
   * Query conversion order list
   */
  async getOrderFromOpen(params: {
    accountType?: number
    cursor?: string
    limit?: number
    toCoin?: string
    fromCoin?: string
    startTime?: number
    endTime?: number
    type?: number
    exchangeStatus?: number
    direction?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path: '/v5/asset/exchange/query-order-list',
      signed: true,
      query: params,
    })
  }

  /**
   * Get Portfolio Margin Info
   * @see https://bybit-exchange.github.io/docs/v5/asset/portfolio-margin
   */
  async getPortfolioMargin(params: {
    baseCoin?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path: '/v5/asset/portfolio-margin',
      signed: true,
      query: params,
    })
  }

  /**
   * Get Total Members Assets
   * @see https://bybit-exchange.github.io/docs/v5/asset/total-members-assets
   */
  async getTotalMembersAssets(params: {
    coin?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path: '/v5/asset/total-members-assets',
      signed: true,
      query: params,
    })
  }

  /**
   * Save Transferable Sub Member List
   * @see https://bybit-exchange.github.io/docs/v5/abandon/enable-unitransfer-subuid
   */
  async transferSubMemberSave(params: {
    subMemberIds: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path: '/v5/asset/transfer/save-transfer-sub-member',
      signed: true,
      body: params,
    })
  }

  /**
   * Get Withdrawal Address List
   * @see https://bybit-exchange.github.io/docs/v5/asset/withdraw/withdraw-address
   */
  async getWithdrawAddresses(params: {
    coin?: string
    chain?: string
    addressType?: number
    limit?: number
    cursor?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path: '/v5/asset/withdraw/query-address',
      signed: true,
      query: params,
    })
  }

  /**
   * Get Available VASPs
   * @see https://bybit-exchange.github.io/docs/v5/asset/withdraw/vasp-list
   */
  async getVaspList(): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path: '/v5/asset/withdraw/vasp/list',
      signed: true,
    })
  }

}
