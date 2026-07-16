# bybit-official-ts-sdk

[![npm version](https://img.shields.io/npm/v/bybit-official-ts-sdk.svg)](https://www.npmjs.com/package/bybit-official-ts-sdk)
[![Node ≥ 18](https://img.shields.io/badge/node-%E2%89%A518-brightgreen.svg)](https://nodejs.org)
[![TypeScript-first](https://img.shields.io/badge/TypeScript-first-3178c6.svg)](https://www.typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![CI](https://github.com/bybit-exchange/bybit.js.api/actions/workflows/ci.yml/badge.svg)](https://github.com/bybit-exchange/bybit.js.api/actions/workflows/ci.yml)

Official lightweight TypeScript / JavaScript connector for the [Bybit V5 REST API](https://bybit-exchange.github.io/docs/v5/intro).

`bybit-official-ts-sdk` is a thin, typed wrapper around the Bybit V5 HTTP endpoints. It ships as a single npm package with one service class per API group (`market`, `trade`, `account`, `position`, `asset`, `user`, `affiliate`, `broker`, `crypto-loan`, `rfq`, `spot-margin`, `earn`, `p2p`, `bot`). Its goal is the same as [`pybit`](https://github.com/bybit-exchange/pybit) on the Python side: an easy-to-use, high-performance connector with a small dependency footprint.

The client currently exposes REST endpoints across **14 service modules**, all reachable from a single `BybitClient`.

Capabilities in this release:

- Market data (kline, orderbook, tickers, funding rate, open interest, RPI orderbook)
- Order lifecycle: create / amend / cancel + batch variants + pre-check
- Positions: leverage, TP/SL, auto-margin, move-position, closed PnL
- Account: wallet balance, margin mode, collateral, fee rate, transaction log
- Assets: deposit / withdraw / internal-transfer / universal-transfer / convert
- Users & sub-accounts, API-key management
- Crypto Loan (flexible + fixed), Earn (Advance / RWA / PWM / Liquidity Mining), Spot Margin
- RFQ (block trades), Affiliate, Broker, P2P, Bot (grid / futures-grid / futures-combo / futures-martingale / DCA)
- Typed error hierarchy — network / timeout / rate-limit / auth / parse / API errors
- Rate-limit budget headers surfaced per response
- Dual CJS + ESM package with `exports` map + `provenance`-signed publishes

WebSocket streams are not yet implemented — see [Roadmap](#roadmap).

---

## Table of Contents

- [About](#about)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Cookbook](#cookbook)
- [Configuration](#configuration)
- [Authentication](#authentication)
- [Testnet](#testnet)
- [Services](#services)
- [Working with the V5 API](#working-with-the-v5-api)
- [Pagination](#pagination)
- [Rate Limit Info](#rate-limit-info)
- [Error Handling](#error-handling)
- [Automatic Retry](#automatic-retry)
- [Response Shape](#response-shape)
- [TypeScript](#typescript)
- [Custom Axios Instance](#custom-axios-instance)
- [Roadmap](#roadmap)
- [Contact](#contact)
- [Contributing](#contributing)
- [License](#license)

---

## About

Bybit maintains first-party SDKs for [`bybit-java-api`](https://github.com/bybit-exchange/bybit-java-api), [`bybit.net.api`](https://github.com/bybit-exchange/bybit.net.api), [`bybit.go.api`](https://github.com/bybit-exchange/bybit.go.api), [`pybit`](https://github.com/bybit-exchange/pybit), and [`bybit-rust-api`](https://github.com/bybit-exchange/bybit-rust-api). This repo is the TypeScript / JavaScript connector.

Design choices:

- **TypeScript-first.** Every endpoint is a typed `async` method. High-value endpoints ship narrow response DTOs; other endpoints return `ApiResponse<unknown>` and can be narrowed by the caller.
- **Params object, always.** Every endpoint takes a single `params` object argument — no positional parameters. This makes call sites self-documenting and forward-compatible when new optional params land.
- **One dependency**: `axios`. Users who prefer another HTTP stack can pass their own `AxiosInstance` and the SDK will reuse it.
- **Typed error hierarchy.** Network / timeout / rate-limit / auth / parse / API errors are distinct classes so callers can branch on `instanceof`.

## Installation

Node 18 or higher is required.

```bash
npm install bybit-official-ts-sdk
# or
yarn add bybit-official-ts-sdk
# or
pnpm add bybit-official-ts-sdk
```

The package ships dual entrypoints — both ESM `import` and CommonJS `require` are supported:

```ts
// ESM (TypeScript, modern Node, bundlers)
import { BybitClient } from 'bybit-official-ts-sdk'
```

```js
// CommonJS (require)
const { BybitClient } = require('bybit-official-ts-sdk')
```

## Quick Start

Get an API key at <https://www.bybit.com/app/user/api-management> (mainnet) or <https://testnet.bybit.com/app/user/api-management> (testnet). Whitelist your IP on the key page — otherwise every signed call fails with `retCode 10010`.

```ts
import { BybitClient } from 'bybit-official-ts-sdk'

const client = new BybitClient({
  apiKey:    process.env.BYBIT_KEY,
  apiSecret: process.env.BYBIT_SECRET,
  testnet:   true,        // omit for mainnet
})

// Public endpoint — no auth needed
const time = await client.market.getServerTime()
console.log(time.result)

// Signed endpoint — apiKey / apiSecret required
const wallet = await client.account.getWalletBalance({ accountType: 'UNIFIED' })
console.log(wallet.result.list)

// Place an order
const order = await client.trade.createOrder({
  category:    'linear',
  symbol:      'BTCUSDT',
  side:        'Buy',
  orderType:   'Limit',
  qty:         '0.01',     // strings — never Number() cast (see Working with the V5 API)
  price:       '30000',
  timeInForce: 'GTC',
})
console.log('orderId:', order.result.orderId)
```

## Cookbook

Copy-pasteable recipes for the most common flows. All examples assume:

```ts
import { BybitClient, BybitApiError, BybitRateLimitError, getRateLimit } from 'bybit-official-ts-sdk'
const client = new BybitClient({ apiKey: process.env.BYBIT_KEY, apiSecret: process.env.BYBIT_SECRET, testnet: true })
```

### Place → check → amend → cancel a limit order

```ts
// 1. Place
const placed = await client.trade.createOrder({
  category: 'linear', symbol: 'BTCUSDT', side: 'Buy', orderType: 'Limit',
  qty: '0.01', price: '20000', timeInForce: 'GTC', orderLinkId: 'my-order-1',
})
const orderId = placed.result.orderId

// 2. Check
const status = await client.trade.getOpenOrders({ category: 'linear', symbol: 'BTCUSDT', orderId })
console.log(status.result.list[0]?.orderStatus)

// 3. Amend price
await client.trade.amendOrder({ category: 'linear', symbol: 'BTCUSDT', orderId, price: '21000' })

// 4. Cancel
await client.trade.cancelOrder({ category: 'linear', symbol: 'BTCUSDT', orderId })
```

### Batch place multiple orders

```ts
const batch = await client.trade.batchCreateOrders({
  category: 'linear',
  request: [
    { symbol: 'BTCUSDT', side: 'Buy',  orderType: 'Limit', qty: '0.01', price: '20000', timeInForce: 'GTC' },
    { symbol: 'ETHUSDT', side: 'Sell', orderType: 'Limit', qty: '0.1',  price: '3000',  timeInForce: 'GTC' },
  ],
})
for (const ack of batch.result.list) console.log(ack.orderId, ack.orderLinkId)
```

### Get open positions (paginated)

```ts
let cursor: string | undefined
do {
  const page = await client.position.getPositionInfo({ category: 'linear', limit: 50, cursor })
  for (const p of page.result.list) {
    console.log(p.symbol, p.side, p.size, 'unrealisedPnl:', p.unrealisedPnl)
  }
  cursor = page.result.nextPageCursor
} while (cursor)
```

### Query the transaction log (last hour)

```ts
const now  = Date.now()
const from = now - 60 * 60 * 1000
const log  = await client.account.getTransactionLog({
  accountType: 'UNIFIED',
  category:    'linear',
  startTime:   from,
  endTime:     now,
  limit:       50,
})
console.log(log.result)
```

### Consume rate-limit budget

```ts
const positions = await client.position.getPositionInfo({ category: 'linear' })
const rl = getRateLimit(positions)
if (rl && Number(rl.remaining) < 10) {
  // Back off before Bybit does it for you.
  await new Promise((r) => setTimeout(r, 500))
}
```

### Withdraw with retry-safe error handling

```ts
try {
  await client.asset.createWithdrawal({
    coin:      'USDT',
    chain:     'ETH',
    address:   '0x…',
    amount:    '100',
    timestamp: Date.now(),
  })
} catch (err) {
  if (err instanceof BybitRateLimitError) {
    await new Promise((r) => setTimeout(r, err.retryAfterMs ?? 1000))
    // safe to retry a withdraw only if you kept the SAME requestId (Bybit dedupes)
  }
  if (err instanceof BybitApiError && err.retCode === 30049) {
    // withdrawal amount too small — surface to caller, do not retry
  }
  throw err
}
```

## Configuration

Every option below is on the `RestClientOptions` object passed to `new BybitClient({...})`.

| Option | Type | Default | Description |
|---|---|---|---|
| `apiKey` | `string` | — | API key. Required for signed endpoints. |
| `apiSecret` | `string` | — | API secret used for HMAC-SHA256 signing. Required for signed endpoints. Never enumerated on the client instance; also redacted by the client's `toJSON` / `redactedOptions()`. |
| `testnet` | `boolean` | `false` | If `true`, uses `https://api-testnet.bybit.com`. Ignored when `baseUrl` is set. |
| `baseUrl` | `string` | see below | Full base URL override (e.g. for a self-hosted proxy). Wins over `testnet`. |
| `recvWindow` | `string` | `'5000'` | `X-BAPI-RECV-WINDOW` header value, in ms. Increase if you see `10002` errors due to client-clock skew. |
| `timeout` | `number` | `10000` | Per-request timeout, ms. Passed to axios. |
| `axiosInstance` | `AxiosInstance` | — | Bring your own axios instance — interceptors, agents, retries, whatever you need. **Mutually exclusive** with `baseUrl` / `testnet` / `timeout`: pass any of those alongside `axiosInstance` and the constructor throws. |

Default base URLs:
- Mainnet: `https://api.bybit.com`
- Testnet: `https://api-testnet.bybit.com`

Exported constants: `BASE_URL_MAINNET`, `BASE_URL_TESTNET`, `DEFAULT_RECV_WINDOW`, `DEFAULT_TIMEOUT_MS`.

## Authentication

Signed endpoints use Bybit's V5 HMAC-SHA256 header signing scheme. The SDK builds and attaches these headers automatically when `signed: true` on a request:

- `X-BAPI-API-KEY`
- `X-BAPI-TIMESTAMP`
- `X-BAPI-RECV-WINDOW`
- `X-BAPI-SIGN` — `HMAC_SHA256(apiSecret, timestamp + apiKey + recvWindow + payload)`
- `X-BAPI-SIGN-TYPE` — `2` (HMAC-SHA256)

If you invoke a signed endpoint without `apiKey` / `apiSecret`, the SDK throws before making the network call.

Public endpoints under `/v5/market/*` are called with no auth headers.

## Testnet

Toggle via the `testnet` flag:

```ts
const client = new BybitClient({
  apiKey:    process.env.BYBIT_TESTNET_KEY,
  apiSecret: process.env.BYBIT_TESTNET_SECRET,
  testnet:   true,
})
```

Get testnet API credentials from <https://testnet.bybit.com>. **Testnet and mainnet keys are separate** — a mainnet key will fail on testnet with `retCode 10003`.

## Services

Each API group is a property on `BybitClient`:

```ts
client.market        // MarketService        — public market data (kline, tickers, orderbook, …)
client.trade         // TradeService         — orders (create / amend / cancel / batch / history)
client.position      // PositionService      — positions, leverage, TP/SL, move-position
client.account       // AccountService       — wallet, margin, collateral, fee-rate, transfer log
client.asset         // AssetService         — deposit / withdraw / transfer / convert / coin info
client.user          // UserService          — sub-accounts, API-key management
client.affiliate     // AffiliateService     — sub-affiliate lists
client.broker        // BrokerService        — broker earnings, distributions
client.cryptoLoan    // CryptoLoanService    — flexible / fixed crypto loans
client.rfq           // RfqService           — request-for-quote (block trades)
client.spotMargin    // SpotMarginService    — UTA spot margin
client.earn          // EarnService          — earn, liquidity mining, RWA, PWM, hold-to-earn
client.p2p           // P2pService           — P2P advertise / order / chat
client.bot           // BotService           — DCA / grid / futures-combo / futures-grid / martingale
```

### Wire-key conventions

Every service accepts `camelCase` fields on the call site. Bot-family endpoints (grid / futures-grid / futures-combo / futures-martingale / DCA) require `snake_case` on the wire — the SDK translates the body internally so your call sites stay consistent. `BotService.createDcaBot.parameters` is passed through verbatim, so if you're constructing a DCA strategy body yourself, use the exact keys from the Bybit docs.

## Working with the V5 API

### Decimal precision — always pass strings

Every price, quantity, amount, and margin field is typed as `string` on purpose. Bybit rejects any request that loses precision on the wire:

```ts
// ✅ Correct — string preserves precision.
await client.trade.createOrder({ /* … */ qty: '0.001', price: '43125.55' })

// ❌ Wrong — retCode 10001 "params error" from Bybit, or subtle rounding.
await client.trade.createOrder({ /* … */ qty: 0.001 as any, price: 43125.55 as any })
```

Compute with a decimal library (`decimal.js`, `big.js`, `bignumber.js`) and call `.toString()` on the way in.

### Category primer

Every V5 endpoint that spans multiple product lines takes a `category` field. The valid values:

| `category` | Product |
|---|---|
| `spot` | Spot trading |
| `linear` | USDT / USDC perpetual + futures |
| `inverse` | Inverse (coin-margined) perpetual + futures |
| `option` | USDC options |

Full product reference: <https://bybit-exchange.github.io/docs/v5/intro#product-types>.

The `Category` type is a `'spot' \| 'linear' \| 'inverse' \| 'option'` union with a `(string & {})` escape hatch, so future values won't break your build.

## Pagination

Every list endpoint uses a cursor + limit pattern. Bybit returns `nextPageCursor` (empty string when no more pages):

```ts
const cursors = ['']  // start with empty cursor
const trades: any[] = []
let cursor: string | undefined

do {
  const page = await client.trade.getTradeHistory({
    category: 'linear',
    symbol:   'BTCUSDT',
    limit:    50,
    cursor,
  })
  trades.push(...page.result.list)
  cursor = page.result.nextPageCursor
} while (cursor)
```

Applies uniformly to `getOpenOrders`, `getOrderHistory`, `getTradeHistory`, `getPositionInfo`, `getClosedPnl`, `getWithdrawRecords`, `getInternalTransferRecords`, `getTransactionLog`, and every other `list`-returning method.

## Rate Limit Info

Bybit V5 returns rate-limit budget headers (`X-Bapi-Limit`, `X-Bapi-Limit-Status`, `X-Bapi-Limit-Reset-Timestamp`) on successful responses. The SDK attaches them non-enumerably to the response body so JSON serialization stays unchanged:

```ts
import { getRateLimit } from 'bybit-official-ts-sdk'

const positions = await client.position.getPositionInfo({ category: 'linear' })
const limit = getRateLimit(positions)
if (limit && Number(limit.remaining) < 10) {
  // slow down
}
```

## Error Handling

Every failure is a subclass of `BybitError` — branch with `instanceof`:

```ts
import {
  BybitClient,
  BybitApiError,
  BybitAuthError,
  BybitRateLimitError,
  BybitTimeoutError,
  BybitNetworkError,
  BybitParseError,
} from 'bybit-official-ts-sdk'

try {
  await client.trade.createOrder({ /* … */ })
} catch (err) {
  if (err instanceof BybitAuthError) {
    // 10003 / 10004 / 10005 / 10007 / 10008 / 10009 / 10010 / 10029 or HTTP 401/403.
    // Rotate keys, re-authenticate — do NOT retry blindly.
    return rotateKeys()
  }
  if (err instanceof BybitRateLimitError) {
    // retCodes 10006 / 10018 or HTTP 429 / CF-blocked 403.
    // Back off using err.retryAfterMs / err.resetAt.
    return backoff(err.retryAfterMs)
  }
  if (err instanceof BybitTimeoutError) {
    // Retry with idempotency (only for GETs or explicitly idempotent POSTs).
  }
  if (err instanceof BybitNetworkError) {
    // DNS / TCP / TLS / connection reset — safe to retry.
  }
  if (err instanceof BybitApiError) {
    // Any other retCode ≠ 0. err.retCode / err.retMsg / err.result available.
  }
  if (err instanceof BybitParseError) {
    // Non-JSON or unexpected body. err.rawBody / err.status available.
  }
  throw err
}
```

All `BybitError` subclasses carry a `.context` field:

```ts
interface BybitErrorContext {
  method:      'GET' | 'POST' | 'PUT' | 'DELETE'
  path:        string
  timestamp?:  string
  recvWindow?: string
}
```

`context` never contains secrets. Axios error metadata stored in `.cause` is scrubbed to `{ name, message, code, status }` before storage; nothing under `config.headers` is retained.

### Common retCodes

The most-hit V5 retCodes and which error class they surface as:

| retCode | Meaning | Class | Suggested action |
|---:|---|---|---|
| `10001` | Params error (malformed body, wrong types, precision loss) | `BybitApiError` | Fix the request; do NOT retry |
| `10002` | Timestamp out of `recv_window` | `BybitApiError` | Sync clock (NTP) or raise `recvWindow` |
| `10003` | Invalid API key | `BybitAuthError` | Wrong env (mainnet vs testnet) or revoked key |
| `10004` | Signature error | `BybitAuthError` | Almost always a codebase bug — regenerate key & test with SDK |
| `10005` | Permission denied | `BybitAuthError` | Enable the required scope on the key |
| `10006` | Rate limit exceeded (account) | `BybitRateLimitError` | Back off via `err.retryAfterMs` / `err.resetAt` |
| `10007` | User auth failed | `BybitAuthError` | Reset key |
| `10009` | IP not whitelisted | `BybitAuthError` | Add caller IP to the key's IP whitelist |
| `10010` | Request IP mismatch | `BybitAuthError` | Same — check egress IP |
| `10018` | IP request frequency limit | `BybitRateLimitError` | Global back-off; consider request coalescing |
| `10029` | Timestamp too old / recv_window mismatch | `BybitAuthError` | Retry with a fresh timestamp |
| `110007` | Insufficient available balance | `BybitApiError` | Surface to caller; do NOT retry |
| `110043` | Set leverage not modified | `BybitApiError` | Idempotent success — treat as no-op |

Full retCode reference: <https://bybit-exchange.github.io/docs/v5/error>.

## Automatic Retry

The SDK does not retry by default — for a trading SDK, that is the safer choice (imagine an accidental retry of a `createOrder` that already succeeded). If you need retries, attach [`axios-retry`](https://www.npmjs.com/package/axios-retry) to your own axios instance and pass it in:

```ts
import axios from 'axios'
import axiosRetry from 'axios-retry'
import {
  BybitClient,
  BybitTimeoutError,
  BybitNetworkError,
  BybitRateLimitError,
} from 'bybit-official-ts-sdk'

const http = axios.create({ baseURL: 'https://api.bybit.com', timeout: 10_000 })
axiosRetry(http, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  // Retry only on network / timeout / 429 — never on 4xx / retCode business errors.
  retryCondition: (err) =>
    axiosRetry.isNetworkOrIdempotentRequestError(err) || err.response?.status === 429,
})

const client = new BybitClient({
  apiKey:        process.env.BYBIT_KEY,
  apiSecret:     process.env.BYBIT_SECRET,
  axiosInstance: http,
})
```

Rules of thumb — what to retry:

| Condition | Safe to retry? |
|---|---|
| `BybitTimeoutError` on a GET | ✅ |
| `BybitTimeoutError` on a POST (create/amend/cancel) | ⚠️ Only if you use `orderLinkId` or `requestId` — Bybit dedupes on both |
| `BybitNetworkError` | ✅ (connection didn't reach Bybit) |
| `BybitRateLimitError` | ✅ after `err.retryAfterMs` |
| `BybitAuthError` | ❌ never — same call will fail identically |
| `BybitApiError` (any retCode ≠ 0) | ❌ business error — surface to caller |
| HTTP 5xx | ✅ after backoff |

## Response Shape

Every successful call returns the raw Bybit `ApiResponse<T>`:

```ts
export interface ApiResponse<T = unknown> {
  retCode:    number
  retMsg:     string
  result:     T
  retExtInfo: Record<string, unknown>
  time:       number
}
```

The following endpoints ship narrow `Result` interfaces (autocomplete on `.result.*`):

| Service.method | Result type |
|---|---|
| `market.getTickers` | `TickersResult` |
| `market.getMarketKline` | `KlineResult` |
| `market.getOrderbook` | `OrderbookResult` |
| `market.getServerTime` | `ServerTimeResult` |
| `account.getWalletBalance` | `WalletBalanceResult` |
| `position.getPositionInfo` | `PositionInfoResult` |
| `trade.createOrder` | `CreateOrderResult` |
| `trade.amendOrder` | `AmendOrderResult` |
| `trade.cancelOrder` | `CancelOrderResult` |
| `trade.cancelAllOrders` | `CancelAllOrdersResult` |
| `trade.batchCreateOrders` | `BatchCreateOrdersResult` |
| `trade.batchAmendOrders` | `BatchAmendOrdersResult` |
| `trade.batchCancelOrders` | `BatchCancelOrdersResult` |
| `trade.getOpenOrders` | `OpenOrdersResult` |
| `trade.getOrderHistory` | `OrderHistoryResult` |
| `trade.getTradeHistory` | `TradeHistoryResult` |
| `trade.getTradeHistoryAllTime` | `TradeHistoryResult` |
| `trade.preCheckOrder` | `PreCheckOrderResult` |
| `trade.getSpotBorrowQuota` | `SpotBorrowQuotaResult` |

Other endpoints return `ApiResponse<unknown>` — narrow at the call site. More typed responses are planned; see [Roadmap](#roadmap).

## TypeScript

The package is authored in TypeScript and ships pre-built `.js` + `.d.ts` files with dual CJS / ESM entrypoints and an `exports` map.

```ts
import type { RestClientOptions, ApiResponse, Category, Side } from 'bybit-official-ts-sdk'
```

Every endpoint method's params are typed. Enumerated fields (`category`, `side`, `orderType`, `timeInForce`, `orderStatus`, `accountType`) use `Category | Side | OrderType | TimeInForce | OrderStatus | AccountType` unions with a `(string & {})` escape hatch — future values won't need a bump.

### Semver

While the package is `0.x`, minor version bumps may include breaking changes as we tighten types and stabilize the surface. Pin with `~0.1.0` if that matters for your consumer. Once `1.0.0` ships, standard semver applies.

## Custom Axios Instance

Bring your own `AxiosInstance` when you need interceptors, retries, proxies, or shared connection pooling:

```ts
import axios from 'axios'
import { BybitClient } from 'bybit-official-ts-sdk'

const shared = axios.create({
  baseURL: 'https://api-testnet.bybit.com',
  timeout: 20_000,
  proxy:   { host: 'proxy.example.com', port: 8080 },
})
shared.interceptors.response.use(
  (r) => r,
  (err) => { /* your logging / retry logic */ throw err },
)

const client = new BybitClient({
  apiKey:        process.env.BYBIT_KEY,
  apiSecret:     process.env.BYBIT_SECRET,
  axiosInstance: shared,
})
```

When `axiosInstance` is supplied, `baseUrl` / `testnet` / `timeout` **must not** be set on `RestClientOptions` — the constructor throws if you pass both. Configure everything on your axios instance.

## Roadmap

- **More typed response DTOs.** The initial release ships DTOs for the most-hit endpoints; the rest will follow endpoint-by-endpoint.
- **WebSocket streams.** Only REST is supported today. Public and private WebSocket streams (order updates, wallet updates, mark-price stream) are planned as a separate module.
- **Automatic retry / backoff.** Users needing this today should wrap their own axios instance (see [Automatic Retry](#automatic-retry)).
- **Broader test coverage.** REST wire-shape smoke tests per service are in place; per-endpoint response DTO tests are next.
- **Examples.** More end-to-end scripts under `examples/`.

Contributions in any of these areas are welcome.

## Contact

- Bybit V5 API docs: <https://bybit-exchange.github.io/docs/v5/intro>
- Bybit API community on Telegram: <https://t.me/Bybitapi>
- Issues / feature requests: <https://github.com/bybit-exchange/bybit.js.api/issues>

## Contributing

Bug reports and feature requests: [GitHub Issues](https://github.com/bybit-exchange/bybit.js.api/issues).

Local development:

```bash
git clone https://github.com/bybit-exchange/bybit.js.api.git
cd bybit.js.api
npm install
npm run build      # dual CJS + ESM
npm run lint       # eslint
npm run format     # prettier
npm test           # jest
npm run smoke      # dual-package load check on the built artifact
```

The service files under `src/rest-api/*.ts` are code-generated from the Bybit OpenAPI spec by an internal workflow. Hand-editing is fine for one-off fixes but note that the generator will replace naming / structure changes on the next regeneration run. Prefer PRs that improve:

- The hand-maintained plumbing (`src/http/*`, `src/config.ts`, `src/client.ts`, `src/index.ts`, `src/types/common.ts`)
- Response DTOs under `src/types/`
- Examples, tests, docs

## License

MIT — see [LICENSE](LICENSE).
