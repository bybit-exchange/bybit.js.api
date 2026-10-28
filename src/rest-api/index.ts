// Re-exports for every service class. New services added by the workflow
// are appended below the sentinel comment — preserve the order otherwise.
// gen-sdk-js:service-exports:start
export { AccountService } from './account.js'
export { AffiliateService } from './affiliate.js'
export { AlphaService } from './alpha.js'
export { AssetService } from './asset.js'
export { BotService } from './bot.js'
export { BrokerService } from './broker.js'
export { CryptoLoanService } from './crypto-loan.js'
export { EarnService } from './earn.js'
export { EventService } from './event.js'
export { FiatService } from './fiat.js'
export { LendingService } from './lending.js'
export { MarketService } from './market.js'
export { P2pService } from './p2p.js'
export { PositionService } from './position.js'
export { PreUpgradeService } from './pre-upgrade.js'
export { ReferralService } from './referral.js'
export { RfqService } from './rfq.js'
export { SpotMarginService } from './spot-margin.js'
export { SpotXService } from './spot-x.js'
export { SpreadTradeService } from './spread-trade.js'
export { StrategyService } from './strategy.js'
export { TaxService } from './tax.js'
export { TradeService } from './trade.js'
export { UserService } from './user.js'
// gen-sdk-js:service-exports:end

export type {
  CreateOrderRequest,
  AmendOrderRequest,
  CancelOrderRequest,
  BatchCreateOrderRequest,
  BatchAmendOrderRequest,
  BatchCancelOrderRequest,
} from './trade.js'
export type { CreateStrategyRequest, StrategyCategory, StrategyOrderStatus } from './strategy.js'
