// Re-exports for every service class. New services added by the workflow
// are appended below the sentinel comment — preserve the order otherwise.
// gen-sdk-js:service-exports:start
export { AccountService } from './account'
export { AffiliateService } from './affiliate'
export { AssetService } from './asset'
export { BotService } from './bot'
export { BrokerService } from './broker'
export { CryptoLoanService } from './crypto-loan'
export { EarnService } from './earn'
export { MarketService } from './market'
export { P2pService } from './p2p'
export { PositionService } from './position'
export { RateLimitService } from './rate-limit'
export { RfqService } from './rfq'
export { SpotMarginService } from './spot-margin'
export { TradeService } from './trade'
export { UserService } from './user'
// gen-sdk-js:service-exports:end

export type {
  CreateOrderRequest,
  AmendOrderRequest,
  CancelOrderRequest,
  BatchCreateOrderRequest,
  BatchAmendOrderRequest,
  BatchCancelOrderRequest,
} from './trade'
