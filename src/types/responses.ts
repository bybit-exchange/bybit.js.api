// Hand-curated response DTOs for the most-hit Bybit V5 endpoints.
// Fields kept close to the wire — string-typed decimals stay strings to preserve precision.
// Non-listed endpoints continue to return ApiResponse<unknown>; narrow at the call site.

import type { Category, OrderStatus, OrderType, Paginated, Side, TimeInForce } from './common.js'

// ---------- Market ----------

export interface Ticker {
  symbol:               string
  lastPrice:            string
  indexPrice?:          string
  markPrice?:           string
  prevPrice24h?:        string
  price24hPcnt?:        string
  highPrice24h?:        string
  lowPrice24h?:         string
  turnover24h?:         string
  volume24h?:           string
  bid1Price?:           string
  bid1Size?:            string
  ask1Price?:           string
  ask1Size?:            string
  openInterest?:        string
  openInterestValue?:   string
  fundingRate?:         string
  nextFundingTime?:     string
  predictedDeliveryPrice?: string
  basisRate?:           string
  deliveryFeeRate?:     string
  deliveryTime?:        string
}

export interface TickersResult {
  category: Category
  list:     Ticker[]
}

// Kline entries come back as fixed-length string tuples: [start, open, high, low, close, volume, turnover].
export type KlineTuple = [string, string, string, string, string, string, string]

export interface KlineResult {
  category: Category
  symbol:   string
  list:     KlineTuple[]
}

export interface OrderbookEntry { price: string; size: string }

export interface OrderbookResult {
  s:  string  // symbol
  b:  Array<[string, string]>  // bids
  a:  Array<[string, string]>  // asks
  ts: number
  u:  number  // update id
  seq?: number
  cts?: number
}

export interface ServerTimeResult {
  timeSecond: string
  timeNano:   string
}

// ---------- Account / Wallet ----------

export interface WalletCoinBalance {
  coin:              string
  equity:            string
  usdValue:          string
  walletBalance:     string
  availableToBorrow?: string
  availableToWithdraw?: string
  accruedInterest?:  string
  totalOrderIM?:     string
  totalPositionIM?:  string
  totalPositionMM?:  string
  unrealisedPnl?:    string
  cumRealisedPnl?:   string
  bonus?:            string
  borrowAmount?:     string
  free?:             string
  locked?:           string
  marginCollateral?: boolean
  collateralSwitch?: boolean
}

export interface WalletBalanceListItem {
  accountType:               string
  totalEquity?:              string
  totalWalletBalance?:       string
  totalMarginBalance?:       string
  totalAvailableBalance?:    string
  totalPerpUPL?:             string
  totalInitialMargin?:       string
  totalMaintenanceMargin?:   string
  accountIMRate?:            string
  accountMMRate?:            string
  accountLTV?:               string
  coin: WalletCoinBalance[]
}

export interface WalletBalanceResult {
  list: WalletBalanceListItem[]
}

// ---------- Trade ----------

export interface CreateOrderResult {
  orderId:     string
  orderLinkId: string
}

export type AmendOrderResult  = CreateOrderResult
export type CancelOrderResult = CreateOrderResult

export interface OrderDetail {
  orderId:            string
  orderLinkId:        string
  blockTradeId?:      string
  symbol:             string
  price:              string
  qty:                string
  side:               Side
  isLeverage?:        string
  positionIdx?:       number
  orderStatus:        OrderStatus
  cancelType?:        string
  rejectReason?:      string
  avgPrice?:          string
  leavesQty?:         string
  leavesValue?:       string
  cumExecQty?:        string
  cumExecValue?:      string
  cumExecFee?:        string
  timeInForce?:       TimeInForce
  orderType?:         OrderType
  stopOrderType?:     string
  orderIv?:           string
  triggerPrice?:      string
  takeProfit?:        string
  stopLoss?:          string
  tpTriggerBy?:       string
  slTriggerBy?:       string
  triggerDirection?:  number
  triggerBy?:         string
  lastPriceOnCreated?: string
  reduceOnly?:        boolean
  closeOnTrigger?:    boolean
  smpType?:           string
  smpGroup?:          number
  smpOrderId?:        string
  tpslMode?:          string
  tpLimitPrice?:      string
  slLimitPrice?:      string
  createdTime?:       string
  updatedTime?:       string
}

export type OpenOrdersResult    = Paginated<OrderDetail>
export type OrderHistoryResult  = Paginated<OrderDetail>
export type TradeHistoryResult  = Paginated<ExecDetail>

export interface ExecDetail {
  symbol:      string
  orderId:     string
  orderLinkId: string
  side:        Side
  orderPrice?: string
  orderQty?:   string
  leavesQty?:  string
  createType?: string
  orderType?:  OrderType
  stopOrderType?: string
  execFee?:    string
  execId?:     string
  execPrice?:  string
  execQty?:    string
  execTime?:   string
  execType?:   string
  execValue?:  string
  feeRate?:    string
  isMaker?:    boolean
}

// ---------- Position ----------

export interface PositionDetail {
  positionIdx?:      number
  riskId?:           number
  riskLimitValue?:   string
  symbol:            string
  side?:             Side
  size?:             string
  avgPrice?:         string
  positionValue?:    string
  tradeMode?:        number
  positionStatus?:   string
  autoAddMargin?:    number
  adlRankIndicator?: number
  leverage?:         string
  positionBalance?:  string
  markPrice?:        string
  liqPrice?:         string
  bustPrice?:        string
  positionMM?:       string
  positionIM?:       string
  tpslMode?:         string
  takeProfit?:       string
  stopLoss?:         string
  trailingStop?:     string
  unrealisedPnl?:    string
  curRealisedPnl?:   string
  cumRealisedPnl?:   string
  createdTime?:      string
  updatedTime?:      string
}

export type PositionInfoResult = Paginated<PositionDetail>

// ---------- Trade batch / pre-check / borrow ----------

// Batch endpoints return two parallel arrays: acks + per-item retCode/retMsg.
export interface BatchOrderAck extends CreateOrderResult {
  category?:   Category
  symbol?:     string
  createAt?:   string
}

export interface BatchOrderExtInfo {
  code: number
  msg:  string
}

export interface BatchCreateOrdersResult {
  list: BatchOrderAck[]
}

export interface BatchAmendOrdersResult {
  list: BatchOrderAck[]
}

export interface BatchCancelOrdersResult {
  list: BatchOrderAck[]
}

// cancel-all returns a compact list of what was cancelled (may be empty on no-op).
export interface CancelAllOrdersResult {
  list?:    Array<{ orderId: string; orderLinkId: string }>
  success?: string
}

export interface PreCheckOrderResult {
  imDeltaAmt?:   string
  mmDeltaAmt?:   string
  aboutToLiquidate?: boolean
  [key: string]: unknown
}

export interface SpotBorrowQuotaResult {
  symbol:           string
  side:             string
  maxTradeQty:      string
  maxTradeAmount:   string
  spotMaxTradeQty?: string
  spotMaxTradeAmount?: string
  borrowCoin:       string
}
