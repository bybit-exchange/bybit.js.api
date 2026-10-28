import type { CreateStrategyRequest, StrategyOrderStatus } from '../../src/rest-api/strategy.js'

const chaseByValue: CreateStrategyRequest = {
  category: 'UTA_USDT',
  symbol: 'BTCUSDT',
  side: 'Buy',
  strategyType: 'chaseOrder',
  positionValue: '1000',
}

const twapByValue: CreateStrategyRequest = {
  category: 'UTA_USDT',
  symbol: 'BTCUSDT',
  side: 'Buy',
  strategyType: 'twap',
  positionValue: '1000',
  duration: 300,
}

const icebergBySize: CreateStrategyRequest = {
  category: 'UTA_USDT',
  symbol: 'BTCUSDT',
  side: 'Buy',
  strategyType: 'iceberg',
  size: '1',
  subSize: '0.1',
}

const povByDuration: CreateStrategyRequest = {
  category: 'UTA_USDT',
  symbol: 'BTCUSDT',
  side: 'Buy',
  strategyType: 'pov',
  duration: 900,
  povParams: {
    mode: 'TradedVolume',
    participationRate: '25',
    referenceWindow: '60',
  },
}

const canceled: StrategyOrderStatus = '7'

// @ts-expect-error status 1 is obsolete
const obsolete: StrategyOrderStatus = '1'

// @ts-expect-error quantity and value are mutually exclusive
const ambiguous: CreateStrategyRequest = {
  category: 'UTA_USDT',
  symbol: 'BTCUSDT',
  side: 'Buy',
  strategyType: 'twap',
  size: '1',
  positionValue: '1000',
  duration: 300,
}

// @ts-expect-error iceberg requires exactly one total quantity field
const icebergWithoutQuantity: CreateStrategyRequest = {
  category: 'UTA_USDT',
  symbol: 'BTCUSDT',
  side: 'Buy',
  strategyType: 'iceberg',
}

// @ts-expect-error iceberg total quantity fields are mutually exclusive
const ambiguousIceberg: CreateStrategyRequest = {
  category: 'UTA_USDT',
  symbol: 'BTCUSDT',
  side: 'Buy',
  strategyType: 'iceberg',
  size: '1',
  positionValue: '1000',
}

// @ts-expect-error POV size and positionValue are mutually exclusive
const ambiguousPov: CreateStrategyRequest = {
  category: 'UTA_USDT',
  symbol: 'BTCUSDT',
  side: 'Buy',
  strategyType: 'pov',
  size: '1',
  positionValue: '1000',
  povParams: {
    mode: 'TradedVolume',
    participationRate: '25',
  },
}

void [
  chaseByValue,
  twapByValue,
  icebergBySize,
  povByDuration,
  canceled,
  obsolete,
  ambiguous,
  icebergWithoutQuantity,
  ambiguousIceberg,
  ambiguousPov,
]
