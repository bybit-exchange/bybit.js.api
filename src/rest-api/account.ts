import type { AxiosInstance } from 'axios'
import { requestJson } from '../http/request.js'
import type { ApiResponse, Category, AccountType } from '../types/common.js'
import type { WalletBalanceResult } from '../types/responses.js'
import type { CollateralSwitchItem } from '../types/nested.js'
import type { RestClientOptions } from '../config.js'

export class AccountService {
  constructor(
    protected readonly http: AxiosInstance,
    protected readonly opts: RestClientOptions,
  ) {}

  /**
   * Batch Set Collateral - Batch set collateral coin switches for Unified account.
   * @see https://bybit-exchange.github.io/docs/v5/account/batch-set-collateral
   */
  async batchSetCollateral(params: {
    request: CollateralSwitchItem[]
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/account/set-collateral-switch-batch',
      signed: true,
      body: {
        request: params.request,
      },
    })
  }

  /**
   * Get Account Info - Query the margin mode configuration of the account.
   * @see https://bybit-exchange.github.io/docs/v5/account/account-info
   */
  async getAccountInfo(): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/account/info',
      signed: true,
    })
  }

  /**
   * Get Account Instruments - Query the instruments information for the account.
   */
  async getAccountInstruments(params: {
    category: Category
    symbol?:  string
    limit?:   number
    cursor?:  string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/account/instruments-info',
      signed: true,
      query: {
        category: params.category,
        symbol:   params.symbol,
        limit:    params.limit,
        cursor:   params.cursor,
      },
    })
  }

  /**
   * Get Borrow History - Query interest records, sorted in reverse order of creation time.
   * @see https://bybit-exchange.github.io/docs/v5/account/borrow-history
   */
  async getBorrowHistory(params: {
    currency?:  string
    startTime?: number
    endTime?:   number
    limit?:     number
    cursor?:    string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/account/borrow-history',
      signed: true,
      query: {
        currency:  params.currency,
        startTime: params.startTime,
        endTime:   params.endTime,
        limit:     params.limit,
        cursor:    params.cursor,
      },
    })
  }

  /**
   * Get Collateral Info - Query the collateral coin information for the current UTA account.
   * @see https://bybit-exchange.github.io/docs/v5/account/collateral-info
   */
  async getCollateralInfo(params: {
    currency?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/account/collateral-info',
      signed: true,
      query: {
        currency: params.currency,
      },
    })
  }

  /**
   * Get DCP Info - Query the DCP (disconnect protect) configuration information.
   * @see https://bybit-exchange.github.io/docs/v5/account/dcp-info
   */
  async getDcpInfo(): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/account/query-dcp-info',
      signed: true,
    })
  }

  /**
   * Get Fee Rate - Query the trading fee rate for a specific symbol or coin.
   * @see https://bybit-exchange.github.io/docs/v5/account/fee-rate
   */
  async getFeeRate(params: {
    category:  Category
    symbol?:   string
    baseCoin?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/account/fee-rate',
      signed: true,
      query: {
        category: params.category,
        symbol:   params.symbol,
        baseCoin: params.baseCoin,
      },
    })
  }

  /**
   * Get MMP State - Query the Market Maker Protection (MMP) status.
   * @see https://bybit-exchange.github.io/docs/v5/account/get-mmp-state
   */
  async getMmpState(params: {
    baseCoin: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/account/mmp-state',
      signed: true,
      query: {
        baseCoin: params.baseCoin,
      },
    })
  }

  /**
   * Get SMP Group - Query the self match prevention (SMP) group ID.
   * @see https://bybit-exchange.github.io/docs/v5/account/smp-group
   */
  async getSmpGroup(): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/account/smp-group',
      signed: true,
    })
  }

  /**
   * Get Transaction Log - Query transaction logs in the Unified account.
   * @see https://bybit-exchange.github.io/docs/v5/account/transaction-log
   */
  async getTransactionLog(params: {
    accountType?:  AccountType
    category?:     Category
    currency?:     string
    baseCoin?:     string
    type?:         string
    transSubType?: string
    startTime?:    number
    endTime?:      number
    limit?:        number
    cursor?:       string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/account/transaction-log',
      signed: true,
      query: {
        accountType:  params.accountType,
        category:     params.category,
        currency:     params.currency,
        baseCoin:     params.baseCoin,
        type:         params.type,
        transSubType: params.transSubType,
        startTime:    params.startTime,
        endTime:      params.endTime,
        limit:        params.limit,
        cursor:       params.cursor,
      },
    })
  }

  /**
   * Get Transferable Amount - Query the transferable amount from a specific coin.
   */
  async getTransferableAmount(params: {
    coinName: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/account/withdrawal',
      signed: true,
      query: {
        coinName: params.coinName,
      },
    })
  }

  /**
   * Get Wallet Balance - Query the wallet balance for a specific account type (and optionally a coin filter).
   * @see https://bybit-exchange.github.io/docs/v5/account/wallet-balance
   */
  async getWalletBalance(params: {
    accountType: AccountType
    coin?:       string
  }): Promise<ApiResponse<WalletBalanceResult>> {
    return requestJson<WalletBalanceResult>(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/account/wallet-balance',
      signed: true,
      query: {
        accountType: params.accountType,
        coin:        params.coin,
      },
    })
  }

  /**
   * Get User Settings - Query the user settings configuration.
   */
  async getUserSettings(): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/account/user-setting-config',
      signed: true,
    })
  }

  /**
   * Manual Borrow - Initiate a manual borrow of a specific coin.
   */
  async manualBorrow(params: {
    coin:   string
    amount: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/account/borrow',
      signed: true,
      body: {
        coin:   params.coin,
        amount: params.amount,
      },
    })
  }

  /**
   * Manual Repay - Initiate a manual repayment of a specific coin.
   */
  async manualRepay(params: {
    coin?:   string
    amount?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/account/repay',
      signed: true,
      body: {
        coin:   params.coin,
        amount: params.amount,
      },
    })
  }

  /**
   * No-Convert Repay - Repay debt without converting the specified coin.
   * @see https://bybit-exchange.github.io/docs/v5/account/no-convert-repay
   */
  async noConvertRepay(params: {
    coin:    string
    amount?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/account/no-convert-repay',
      signed: true,
      body: {
        coin:   params.coin,
        amount: params.amount,
      },
    })
  }

  /**
   * One-Click Repay to clear the debt of the account.
   */
  async oneClickRepay(params: {
    coin?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/account/quick-repayment',
      signed: true,
      body: {
        coin: params.coin,
      },
    })
  }

  /**
   * Reset MMP (Market Maker Protection).
   * @see https://bybit-exchange.github.io/docs/v5/account/reset-mmp
   */
  async resetMmp(params: {
    baseCoin: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/account/mmp-reset',
      signed: true,
      body: {
        baseCoin: params.baseCoin,
      },
    })
  }

  /**
   * Set Collateral Coin, toggle whether a coin can be used as collateral.
   * @see https://bybit-exchange.github.io/docs/v5/account/set-collateral
   */
  async setCollateralCoin(params: {
    coin:             string
    collateralSwitch: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/account/set-collateral-switch',
      signed: true,
      body: {
        coin:             params.coin,
        collateralSwitch: params.collateralSwitch,
      },
    })
  }

  /**
   * Set the margin mode for the account.
   * @see https://bybit-exchange.github.io/docs/v5/account/set-margin-mode
   */
  async setMarginMode(params: {
    setMarginMode: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/account/set-margin-mode',
      signed: true,
      body: {
        setMarginMode: params.setMarginMode,
      },
    })
  }

  /**
   * Set MMP (Market Maker Protection) parameters.
   * @see https://bybit-exchange.github.io/docs/v5/account/set-mmp
   */
  async setMmp(params: {
    baseCoin:     string
    window:       string
    frozenPeriod: string
    qtyLimit:     string
    deltaLimit:   string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/account/mmp-modify',
      signed: true,
      body: {
        baseCoin:     params.baseCoin,
        window:       params.window,
        frozenPeriod: params.frozenPeriod,
        qtyLimit:     params.qtyLimit,
        deltaLimit:   params.deltaLimit,
      },
    })
  }

  /**
   * Set Price Limit to enable or disable order price modification action.
   */
  async setPriceLimit(params: {
    category:     Category
    modifyEnable: boolean
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/account/set-limit-px-action',
      signed: true,
      body: {
        category:     params.category,
        modifyEnable: params.modifyEnable,
      },
    })
  }

  /**
   * Set Spot Hedging mode for UTA Pro accounts.
   * @see https://bybit-exchange.github.io/docs/v5/account/set-spot-hedge
   */
  async setSpotHedging(params: {
    setHedgingMode: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/account/set-hedging-mode',
      signed: true,
      body: {
        setHedgingMode: params.setHedgingMode,
      },
    })
  }

  /**
   * Upgrade the account to Unified Trading Account (UTA) Pro.
   * @see https://bybit-exchange.github.io/docs/v5/account/upgrade-unified-account
   */
  async upgradeToUtaPro(): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/account/upgrade-to-uta',
      signed: true,
    })
  }
}
