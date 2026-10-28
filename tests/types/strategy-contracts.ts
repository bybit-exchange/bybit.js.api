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

void [chaseByValue, twapByValue, canceled, obsolete, ambiguous]
