import type { FiatService } from '../../src/rest-api/fiat.js'
import type { SpreadTradeService } from '../../src/rest-api/spread-trade.js'

type AmendSpreadOrderRequest = Parameters<SpreadTradeService['amendSpreadOrder']>[0]
type CancelSpreadOrderRequest = Parameters<SpreadTradeService['cancelSpreadOrder']>[0]
type FiatBalanceRequest = Parameters<FiatService['queryBalance']>[0]
type FiatReferencePriceRequest = Parameters<FiatService['getReferencePrice']>[0]
type FiatTradeQuery = Parameters<FiatService['queryTrade']>[0]

const amendByOrderId: AmendSpreadOrderRequest = {
  symbol: 'BTCUSDT',
  orderId: 'order-id',
  price: '100',
}

const amendByLinkId: AmendSpreadOrderRequest = {
  symbol: 'BTCUSDT',
  orderLinkId: 'link-id',
  qty: '1',
}

const cancelByBothIds: CancelSpreadOrderRequest = {
  orderId: 'order-id',
  orderLinkId: 'link-id',
}

const queryTradeByTradeNo: FiatTradeQuery = { tradeNo: 'trade-no' }
const queryTradeByMerchantId: FiatTradeQuery = { merchantRequestId: 'merchant-id' }

// @ts-expect-error amend requires orderId or orderLinkId
const amendWithoutIdentity: AmendSpreadOrderRequest = {
  symbol: 'BTCUSDT',
  price: '100',
}

// @ts-expect-error amend requires qty or price
const amendWithoutChange: AmendSpreadOrderRequest = {
  symbol: 'BTCUSDT',
  orderId: 'order-id',
}

// @ts-expect-error cancel requires orderId or orderLinkId
const cancelWithoutIdentity: CancelSpreadOrderRequest = {}

// @ts-expect-error trade query requires tradeNo or merchantRequestId
const queryTradeWithoutIdentity: FiatTradeQuery = {}

// @ts-expect-error accountCategory is not part of the public API contract
const balanceWithUndocumentedField: FiatBalanceRequest = { accountCategory: 'fiat' }

const referencePriceWithUndocumentedField: FiatReferencePriceRequest = {
  symbol: 'EUR-USDT',
  // @ts-expect-error paymentMethod is not part of the public API contract
  paymentMethod: 'card',
}

void [
  amendByOrderId,
  amendByLinkId,
  cancelByBothIds,
  queryTradeByTradeNo,
  queryTradeByMerchantId,
  amendWithoutIdentity,
  amendWithoutChange,
  cancelWithoutIdentity,
  queryTradeWithoutIdentity,
  balanceWithUndocumentedField,
  referencePriceWithUndocumentedField,
]
