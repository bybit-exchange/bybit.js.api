import type { AxiosInstance } from 'axios'
import { createHttp } from './http/request'
import { type RestClientOptions } from './config'

// Service imports are appended by the workflow between the sentinel comments.
// gen-sdk-js:client-imports:start
import { AccountService } from './rest-api/account'
import { AffiliateService } from './rest-api/affiliate'
import { AssetService } from './rest-api/asset'
import { BotService } from './rest-api/bot'
import { BrokerService } from './rest-api/broker'
import { CryptoLoanService } from './rest-api/crypto-loan'
import { EarnService } from './rest-api/earn'
import { MarketService } from './rest-api/market'
import { P2pService } from './rest-api/p2p'
import { PositionService } from './rest-api/position'
import { RateLimitService } from './rest-api/rate-limit'
import { RfqService } from './rest-api/rfq'
import { SpotMarginService } from './rest-api/spot-margin'
import { TradeService } from './rest-api/trade'
import { UserService } from './rest-api/user'
// gen-sdk-js:client-imports:end

export class BybitClient {
  public readonly http: AxiosInstance
  public readonly options: RestClientOptions
  // gen-sdk-js:client-fields:start
  public readonly account: AccountService
  public readonly affiliate: AffiliateService
  public readonly asset: AssetService
  public readonly bot: BotService
  public readonly broker: BrokerService
  public readonly cryptoLoan: CryptoLoanService
  public readonly earn: EarnService
  public readonly market: MarketService
  public readonly p2p: P2pService
  public readonly position: PositionService
  public readonly rateLimit: RateLimitService
  public readonly rfq: RfqService
  public readonly spotMargin: SpotMarginService
  public readonly trade: TradeService
  public readonly user: UserService
  // gen-sdk-js:client-fields:end

  constructor(options: RestClientOptions = {}) {
    this.options = options
    this.http = createHttp(options)
    // gen-sdk-js:client-inits:start
    this.account = new AccountService(this.http, this.options)
    this.affiliate = new AffiliateService(this.http, this.options)
    this.asset = new AssetService(this.http, this.options)
    this.bot = new BotService(this.http, this.options)
    this.broker = new BrokerService(this.http, this.options)
    this.cryptoLoan = new CryptoLoanService(this.http, this.options)
    this.earn = new EarnService(this.http, this.options)
    this.market = new MarketService(this.http, this.options)
    this.p2p = new P2pService(this.http, this.options)
    this.position = new PositionService(this.http, this.options)
    this.rateLimit = new RateLimitService(this.http, this.options)
    this.rfq = new RfqService(this.http, this.options)
    this.spotMargin = new SpotMarginService(this.http, this.options)
    this.trade = new TradeService(this.http, this.options)
    this.user = new UserService(this.http, this.options)
    // gen-sdk-js:client-inits:end
  }
}
