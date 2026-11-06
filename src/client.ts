import type { AxiosInstance } from 'axios'
import { createHttp } from './http/request.js'
import { type RestClientOptions } from './config.js'

// Service imports are appended by the workflow between the sentinel comments.
// gen-sdk-js:client-imports:start
import { AccountService } from './rest-api/account.js'
import { AffiliateService } from './rest-api/affiliate.js'
import { AlphaService } from './rest-api/alpha.js'
import { AssetService } from './rest-api/asset.js'
import { BotService } from './rest-api/bot.js'
import { BrokerService } from './rest-api/broker.js'
import { CryptoLoanService } from './rest-api/crypto-loan.js'
import { EarnService } from './rest-api/earn.js'
import { EventService } from './rest-api/event.js'
import { FiatService } from './rest-api/fiat.js'
import { LendingService } from './rest-api/lending.js'
import { MarketService } from './rest-api/market.js'
import { P2pService } from './rest-api/p2p.js'
import { PositionService } from './rest-api/position.js'
import { PreUpgradeService } from './rest-api/pre-upgrade.js'
import { ReferralService } from './rest-api/referral.js'
import { RfqService } from './rest-api/rfq.js'
import { SpotMarginService } from './rest-api/spot-margin.js'
import { SpotXService } from './rest-api/spot-x.js'
import { SpreadTradeService } from './rest-api/spread-trade.js'
import { StrategyService } from './rest-api/strategy.js'
import { TaxService } from './rest-api/tax.js'
import { TradeService } from './rest-api/trade.js'
import { UserService } from './rest-api/user.js'
// gen-sdk-js:client-imports:end

// Safe redacted view of RestClientOptions — never leak apiSecret through inspect / logging.
export interface SafeRestClientOptions
  extends Omit<RestClientOptions, 'apiSecret' | 'axiosInstance'> {
  apiSecret?:     '[REDACTED]'
  axiosInstance?: '[provided]'
}

export class BybitClient {
  // Public escape hatch for advanced callers who need to attach axios interceptors after
  // construction. Mutating this handle in-place is unsupported and may break signing.
  // Prefer passing your own `axiosInstance` in RestClientOptions when you need a custom stack.
  public readonly http: AxiosInstance
  // Options object is stored non-enumerably so JSON.stringify(client) cannot leak apiSecret.
  public readonly options!: RestClientOptions
  // gen-sdk-js:client-fields:start
  public readonly account: AccountService
  public readonly affiliate: AffiliateService
  public readonly alpha: AlphaService
  public readonly asset: AssetService
  public readonly bot: BotService
  public readonly broker: BrokerService
  public readonly cryptoLoan: CryptoLoanService
  public readonly earn: EarnService
  public readonly event: EventService
  public readonly fiat: FiatService
  public readonly lending: LendingService
  public readonly market: MarketService
  public readonly p2p: P2pService
  public readonly position: PositionService
  public readonly preUpgrade: PreUpgradeService
  public readonly referral: ReferralService
  public readonly rfq: RfqService
  public readonly spotMargin: SpotMarginService
  public readonly spotX: SpotXService
  public readonly spreadTrade: SpreadTradeService
  public readonly strategy: StrategyService
  public readonly tax: TaxService
  public readonly trade: TradeService
  public readonly user: UserService
  // gen-sdk-js:client-fields:end

  constructor(options: RestClientOptions = {}) {
    Object.defineProperty(this, 'options', {
      value:        options,
      enumerable:   false,
      configurable: false,
      writable:     false,
    })
    this.http = createHttp(options)
    // gen-sdk-js:client-inits:start
    this.account = new AccountService(this.http, this.options)
    this.affiliate = new AffiliateService(this.http, this.options)
    this.alpha = new AlphaService(this.http, this.options)
    this.asset = new AssetService(this.http, this.options)
    this.bot = new BotService(this.http, this.options)
    this.broker = new BrokerService(this.http, this.options)
    this.cryptoLoan = new CryptoLoanService(this.http, this.options)
    this.earn = new EarnService(this.http, this.options)
    this.event = new EventService(this.http, this.options)
    this.fiat = new FiatService(this.http, this.options)
    this.lending = new LendingService(this.http, this.options)
    this.market = new MarketService(this.http, this.options)
    this.p2p = new P2pService(this.http, this.options)
    this.position = new PositionService(this.http, this.options)
    this.preUpgrade = new PreUpgradeService(this.http, this.options)
    this.referral = new ReferralService(this.http, this.options)
    this.rfq = new RfqService(this.http, this.options)
    this.spotMargin = new SpotMarginService(this.http, this.options)
    this.spotX = new SpotXService(this.http, this.options)
    this.spreadTrade = new SpreadTradeService(this.http, this.options)
    this.strategy = new StrategyService(this.http, this.options)
    this.tax = new TaxService(this.http, this.options)
    this.trade = new TradeService(this.http, this.options)
    this.user = new UserService(this.http, this.options)
    // gen-sdk-js:client-inits:end
  }

  // Redacted view of options — used by JSON.stringify(client), console.log, structured loggers.
  redactedOptions(): SafeRestClientOptions {
    const { apiSecret, axiosInstance, ...rest } = this.options
    const safe: SafeRestClientOptions = { ...rest }
    if (apiSecret !== undefined)     safe.apiSecret     = '[REDACTED]'
    if (axiosInstance !== undefined) safe.axiosInstance = '[provided]'
    return safe
  }

  toJSON(): Record<string, unknown> {
    return { options: this.redactedOptions() }
  }
}
