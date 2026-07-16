// Nested request-body types shared across services. These lock in the *keys* the
// server accepts even when individual field validation is left to Bybit — object
// literals that misspell a key no longer silently pass.

// ---------- account ----------

export interface CollateralSwitchItem {
  coin:             string
  collateralSwitch: string
}

// ---------- earn / advance-order extras ----------

export interface DualAssetsExtra {
  productId?:  string
  purchaseCoin?: string
  purchaseAmount?: string
  targetCoin?: string
  targetPrice?: string
  settlementDate?: string
  [key: string]: unknown
}

export interface InterestCardExtra {
  cardId?:      string
  couponId?:    string
  interestType?: string
  [key: string]: unknown
}

export interface SmartLeverageStakeExtra {
  productId?:   string
  leverage?:    string
  amount?:      string
  autoRenew?:   boolean
  [key: string]: unknown
}

export interface SmartLeverageRedeemExtra {
  productId?:   string
  positionId?:  string
  amount?:      string
  [key: string]: unknown
}

export interface DoubleWinStakeExtra {
  productId?:    string
  amount?:       string
  targetPrice?:  string
  duration?:     string
  [key: string]: unknown
}

export interface DoubleWinRedeemExtra {
  productId?:  string
  positionId?: string
  amount?:     string
  [key: string]: unknown
}

export interface DiscountBuyExtra {
  productId?:  string
  amount?:     string
  couponId?:   string
  [key: string]: unknown
}

// ---------- earn / PWM ----------

export interface CustomPlanProduct {
  productId?:    string
  productType?:  string
  weight?:       string
  amount?:       string
  [key: string]: unknown
}

export interface InvestmentDistributionItem {
  productId?:    string
  weight?:       string
  amount?:       string
  [key: string]: unknown
}

export interface UpdateFundItem {
  fundId?:      string
  amount?:      string
  action?:      string
  [key: string]: unknown
}

// ---------- crypto-loan ----------

export interface CollateralItem {
  coin:   string
  amount: string
}

// ---------- bot ----------

export interface BotSymbolSetting {
  symbol?:      string
  qty?:         string
  side?:        string
  leverage?:    string
  [key: string]: unknown
}

// ---------- broker ----------

export interface BrokerLimitItem {
  uid?:         string
  weightLimit?: string
  [key: string]: unknown
}

// ---------- p2p ----------

export interface P2pPaymentIdItem {
  id?:       string
  type?:     string
  realName?: string
  [key: string]: unknown
}

// ---------- rfq ----------

export interface RfqLegItem {
  symbol?:  string
  side?:    string
  amount?:  string
  [key: string]: unknown
}

export interface RfqCounterpartyItem {
  userId?:  string
  [key: string]: unknown
}

// ---------- position ----------

export interface MovePositionItem {
  category?: string
  symbol?:   string
  price?:    string
  side?:     string
  qty?:      string
  [key: string]: unknown
}
