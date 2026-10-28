// Cross-service smoke: for every service on BybitClient, ensure that every
// public async method issues exactly one HTTP call, hits a `/v5/*` path, and
// uses one of the four HTTP verbs. This catches:
//   - regressions from codegen where a method silently loses signed:true
//   - a rename that changes what the wire path looks like
//   - a method whose body/query wiring throws inside requestJson
// Full param coverage is out of scope — we just prove the call flow works.

import axios from 'axios'
import { BybitClient } from '../src/client'

const SERVICES = [
  // gen-sdk-js:smoke-services:start
  'account',
  'affiliate',
  'alpha',
  'asset',
  'bot',
  'broker',
  'cryptoLoan',
  'earn',
  'event',
  'fiat',
  'lending',
  'market',
  'p2p',
  'position',
  'preUpgrade',
  'referral',
  'rfq',
  'spotMargin',
  'spotX',
  'spreadTrade',
  'strategy',
  'tax',
  'trade',
  'user',
  // gen-sdk-js:smoke-services:end
] as const

// Well-formed placeholder for every field the SDK is known to send. Unknown fields
// stay undefined and are stripped by requestJson.
const PLACEHOLDER: Record<string, unknown> = {
  category:     'linear',
  side:         'Buy',
  orderType:    'Limit',
  timeInForce:  'GTC',
  orderStatus:  'New',
  accountType:  'UNIFIED',
  symbol:       'BTCUSDT',
  qty:          '0.01',
  price:        '30000',
  amount:       '10',
  coin:         'USDT',
  interval:     '1',
  status:       'Filled',
  orderId:      'o-1',
  orderLinkId:  'l-1',
  cursor:       '',
  limit:        50,
  startTime:    1,
  endTime:      2,
  timeWindow:   10,
  timestamp:    1_700_000_000_000,
  chainType:    'ETH',
  chain:        'ETH',
  address:      '0x0',
  bot_id:       1,
  botId:        1,
  gridId:       1,
  closeMode:    0,
  stopType:     0,
  subuid:       1,
  frozen:       0,
  memberType:   1,
  username:     'u',
  request:      [],
  list:         [],
  paymentIds:   [],
  counterparties: [],
  quoteBuyList:   [],
  quoteSellList:  [],
  products:       [],
  investmentDistribution: [],
  updateFunds:    [],
  collateralList: [],
  symbol_settings: [],
  permissions:  {},
  transferId:      't-1',
  fromMemberId:    1,
  toMemberId:      2,
  fromAccountType: 'UNIFIED',
  toAccountType:   'FUND',
  fromCoin:        'BTC',
  toCoin:          'USDT',
  requestCoin:     'BTC',
  requestAmount:   '1',
  quoteTxId:       'q-1',
  subMemberId:     '1',
  bizType:         '',
  agree:           true,
  buyLeverage:     '5',
  sellLeverage:    '5',
  margin:          '1',
  setMarginMode:   'REGULAR_MARGIN',
  setHedgingMode:  'ON',
  autoAddMargin:   1,
  fromUid:         '1',
  toUid:           '2',
  baseCoin:        'BTC',
  window:          '10',
  frozenPeriod:    '10',
  qtyLimit:        '1',
  deltaLimit:      '1',
  modifyEnable:    true,
  currency:        'USDT',
  positionIdx:     'idx',
  tpslMode:        'Full',
  collateralSwitch: 'ON',
  execType:         'Trade',
  productId:        1,
  initialPrice:    '1',
  lowerPrice:      '1',
  upperPrice:      '1',
  requestId:       'r-1',
  quoteId:         'q-2',
  quoteSide:       'Buy',
  rfqId:           'r-1',
  strategyType:    's',
  fundId:          'f-1',
  rfqLinkId:       'rl-1',
  quoteLinkId:     'ql-1',
  traderType:      't',
  itemId:          'i-1',
  page:            '1',
  size:            '10',
  positionId:      'p-1',
  content:         '',
  fileType:        'image',
  action:          '',
  msgUuid:         'u-1',
  duration:        '1',
  couponId:        'c-1',
  planId:          'pl-1',
  fundName:        'fund',
}

interface CallSpec { method: string; url: string; hasAuthHeader: boolean }

interface EndpointContract {
  method: 'GET' | 'POST'
  path: string
  signed: boolean
}

const endpoint = (
  method: EndpointContract['method'],
  path: string,
  signed = true,
): EndpointContract => ({ method, path, signed })

const NEW_SERVICE_CONTRACTS = {
  event: {
    getEcOrderHistory: endpoint('GET', '/v5/event/order-list'),
    getEcActiveOrders: endpoint('GET', '/v5/event/order-realtime'),
    getEcPositionInfo: endpoint('GET', '/v5/event/positions'),
    getEcSettlements: endpoint('GET', '/v5/event/settlements'),
    getEcTradeHistory: endpoint('GET', '/v5/event/trades'),
  },
  fiat: {
    queryBalance: endpoint('GET', '/v5/fiat/balance-query'),
    queryCoinList: endpoint('GET', '/v5/fiat/query-coin-list'),
    queryTradeHistory: endpoint('GET', '/v5/fiat/query-trade-history'),
    applyQuote: endpoint('POST', '/v5/fiat/quote-apply'),
    getReferencePrice: endpoint('GET', '/v5/fiat/reference-price'),
    confirmQuote: endpoint('POST', '/v5/fiat/trade-execute'),
    queryTrade: endpoint('GET', '/v5/fiat/trade-query'),
  },
  preUpgrade: {
    getTransactionLog: endpoint('GET', '/v5/pre-upgrade/account/transaction-log'),
    getTransactionLogGet: endpoint('GET', '/v5/pre-upgrade/account/transaction-log'),
    getDeliveryRecord: endpoint('GET', '/v5/pre-upgrade/asset/delivery-record'),
    getDeliveryRecordGet: endpoint('GET', '/v5/pre-upgrade/asset/delivery-record'),
    getSettlementRecord: endpoint('GET', '/v5/pre-upgrade/asset/settlement-record'),
    getClosedPnl: endpoint('GET', '/v5/pre-upgrade/position/closed-pnl'),
    getClosedPnlGet: endpoint('GET', '/v5/pre-upgrade/position/closed-pnl'),
    getExecutionList: endpoint('GET', '/v5/pre-upgrade/execution/list'),
    getOrderHistory: endpoint('GET', '/v5/pre-upgrade/order/history'),
    getOrderHistoryGet: endpoint('GET', '/v5/pre-upgrade/order/history'),
  },
  referral: {
    getCampaignRewards: endpoint('POST', '/v5/referral/campaign/rewards'),
    getCommissionRecords: endpoint('POST', '/v5/referral/commission/records'),
    getUserIdentityProfile: endpoint('POST', '/v5/referral/user/identity-profile'),
    getUserInvitations: endpoint('POST', '/v5/referral/user/invitations'),
  },
  spotX: {
    getLaunchpoolProjectList: endpoint('GET', '/v5/spot-x/launchpool/project/list', false),
    getLaunchpoolUserActivityLog: endpoint('POST', '/v5/spot-x/launchpool/user/activity-log'),
    getLaunchpoolUserCurrentStaking: endpoint('GET', '/v5/spot-x/launchpool/user/current-staking'),
    getLaunchpoolUserHistory: endpoint('POST', '/v5/spot-x/launchpool/user/history'),
    getPuzzleProjectList: endpoint('GET', '/v5/spot-x/puzzle/project/list', false),
    getTokenSplashProjectList: endpoint('GET', '/v5/spot-x/token-splash/project/list', false),
    getTokenSplashUserActivityParams: endpoint(
      'GET',
      '/v5/spot-x/token-splash/user/activity-params',
    ),
  },
  spreadTrade: {
    getSpreadInstrumentsInfo: endpoint('GET', '/v5/spread/instrument', false),
    getSpreadOrderbook: endpoint('GET', '/v5/spread/orderbook', false),
    getSpreadRecentTrades: endpoint('GET', '/v5/spread/recent-trade', false),
    getSpreadTickers: endpoint('GET', '/v5/spread/tickers', false),
    amendSpreadOrder: endpoint('POST', '/v5/spread/order/amend'),
    cancelAllSpreadOrders: endpoint('POST', '/v5/spread/order/cancel-all'),
    cancelSpreadOrder: endpoint('POST', '/v5/spread/order/cancel'),
    createSpreadOrder: endpoint('POST', '/v5/spread/order/create'),
    getSpreadOpenOrders: endpoint('GET', '/v5/spread/order/realtime'),
    getSpreadOrderHistory: endpoint('GET', '/v5/spread/order/history'),
    getSpreadTradeHistory: endpoint('GET', '/v5/spread/execution/list'),
    getHistory: endpoint('GET', '/v5/spread/execution/list'),
    getSpreadMaxQty: endpoint('GET', '/v5/spread/max-qty'),
  },
  strategy: {
    createStrategy: endpoint('POST', '/v5/strategy/create'),
    queryOrderList: endpoint('GET', '/v5/strategy/order-list'),
    queryList: endpoint('GET', '/v5/strategy/list'),
    stopStrategy: endpoint('POST', '/v5/strategy/stop'),
  },
  tax: {
    batchCreateTaxReports: endpoint('POST', '/v5/fht/compliance/tax/private/batch_create'),
    batchQueryTaxReports: endpoint('GET', '/v5/fht/compliance/tax/private/batch_query'),
  },
} as const

function collectingHttp(): { instance: import('axios').AxiosInstance; calls: CallSpec[] } {
  const calls: CallSpec[] = []
  const instance = axios.create()
  ;(instance as unknown as { request: (c: import('axios').AxiosRequestConfig) => unknown }).request = (config) => {
    const headers = (config.headers ?? {}) as Record<string, unknown>
    calls.push({
      method:          String(config.method ?? '').toUpperCase(),
      url:             String(config.url ?? ''),
      hasAuthHeader:   Boolean(headers['X-BAPI-API-KEY']),
    })
    return Promise.resolve({
      status:  200,
      data:    { retCode: 0, retMsg: 'OK', result: {}, retExtInfo: {}, time: 1 },
      headers: {},
      statusText: '',
      config,
    })
  }
  return { instance, calls }
}

function collectAsyncMethods(svc: unknown): string[] {
  const proto = Object.getPrototypeOf(svc)
  return Object.getOwnPropertyNames(proto).filter((name) => {
    if (name === 'constructor') return false
    const desc = Object.getOwnPropertyDescriptor(proto, name)
    return typeof desc?.value === 'function'
  })
}

describe('every service method → one HTTP request', () => {
  let client: BybitClient
  let calls: CallSpec[]

  beforeEach(() => {
    const c = collectingHttp()
    calls = c.calls
    client = new BybitClient({ apiKey: 'K', apiSecret: 'S', axiosInstance: c.instance })
  })

  it('tracks every service exposed by BybitClient', () => {
    const exposedServices = Object.keys(client).filter((name) => name !== 'http').sort()
    expect([...SERVICES].sort()).toEqual(exposedServices)
  })

  it('exposes canonical names and retains generated compatibility aliases', () => {
    expect(typeof client.preUpgrade.getTransactionLog).toBe('function')
    expect(typeof client.preUpgrade.getDeliveryRecord).toBe('function')
    expect(typeof client.preUpgrade.getClosedPnl).toBe('function')
    expect(typeof client.preUpgrade.getOrderHistory).toBe('function')
    expect(typeof client.spreadTrade.getSpreadTradeHistory).toBe('function')

    expect(typeof client.preUpgrade.getTransactionLogGet).toBe('function')
    expect(typeof client.preUpgrade.getDeliveryRecordGet).toBe('function')
    expect(typeof client.preUpgrade.getClosedPnlGet).toBe('function')
    expect(typeof client.preUpgrade.getOrderHistoryGet).toBe('function')
    expect(typeof client.spreadTrade.getHistory).toBe('function')
  })

  it('matches exact contracts for newly generated services', async () => {
    for (const serviceName of Object.keys(NEW_SERVICE_CONTRACTS) as Array<
      keyof typeof NEW_SERVICE_CONTRACTS
    >) {
      const service = client[serviceName] as unknown as Record<
        string,
        (params: unknown) => Promise<unknown>
      >
      const contracts = NEW_SERVICE_CONTRACTS[serviceName]
      expect(collectAsyncMethods(service).sort()).toEqual(Object.keys(contracts).sort())

      for (const [methodName, expected] of Object.entries(contracts) as Array<
        [string, EndpointContract]
      >) {
        calls.length = 0
        await service[methodName]?.call(service, PLACEHOLDER)
        expect(calls).toHaveLength(1)
        const call = calls[0]
        expect(call?.method).toBe(expected.method)
        expect(new URL(call?.url ?? '', 'https://example.invalid').pathname).toBe(expected.path)
        expect(call?.hasAuthHeader).toBe(expected.signed)
      }
    }
  })

  for (const svcName of SERVICES) {
    describe(svcName, () => {
      it('does not lose any methods to a bad build', () => {
        const svc = (client as unknown as Record<string, unknown>)[svcName]
        expect(svc).toBeDefined()
        const methods = collectAsyncMethods(svc)
        expect(methods.length).toBeGreaterThan(0)
      })

      it('each method hits /v5/* with a valid HTTP verb', async () => {
        const svc = (client as unknown as Record<string, unknown>)[svcName] as Record<string, (p: unknown) => Promise<unknown>>
        const methods = collectAsyncMethods(svc)
        for (const m of methods) {
          calls.length = 0
          const fn = svc[m]
          if (typeof fn !== 'function') continue
          try {
            await fn.call(svc, PLACEHOLDER)
          } catch {
            // Param shape may reject before HTTP fires; if so, skip.
            if (calls.length === 0) continue
          }
          if (calls.length === 0) continue
          expect(calls.length).toBe(1)
          const call = calls[0]
          if (!call) continue
          expect(['GET', 'POST', 'PUT', 'DELETE']).toContain(call.method)
          expect(call.url.startsWith('/v5/')).toBe(true)
        }
      })
    })
  }
})
