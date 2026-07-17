// Re-exports for every service class. New services added by the workflow
// are appended below the sentinel comment — preserve the order otherwise.
// gen-sdk-js:service-exports:start
export { AccountService } from './account.js'
export { AffiliateService } from './affiliate.js'
export { AssetService } from './asset.js'
export { BotService } from './bot.js'
export { BrokerService } from './broker.js'
export { CryptoLoanService } from './crypto-loan.js'
export { EarnService } from './earn.js'
export { MarketService } from './market.js'
export { P2pService } from './p2p.js'
export { PositionService } from './position.js'
export { RfqService } from './rfq.js'
export { SpotMarginService } from './spot-margin.js'
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
