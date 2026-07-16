# @bybit-exchange/api

Official lightweight TypeScript / JavaScript connector for the [Bybit V5 REST API](https://bybit-exchange.github.io/docs/v5/intro).

`@bybit-exchange/api` is a thin, typed wrapper around the Bybit V5 HTTP endpoints. It ships as a single npm package with one service class per API group (`market`, `trade`, `account`, `position`, `asset`, `user`, `affiliate`, `broker`, `crypto-loan`, `rfq`, `spot-margin`, `earn`, `p2p`, `bot`). Its goal is the same as [`pybit`](https://github.com/bybit-exchange/pybit) on the Python side: an easy-to-use, high-performance connector with a small dependency footprint.

The client currently exposes REST endpoints across **14 service modules**, all reachable from a single `BybitClient`.

---

## Table of Contents

- [About](#about)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [Testnet](#testnet)
- [Authentication](#authentication)
- [Services](#services)
- [Error Handling](#error-handling)
- [Rate Limit Info](#rate-limit-info)
- [Response Shape](#response-shape)
- [TypeScript](#typescript)
- [Custom Axios Instance](#custom-axios-instance)
- [Roadmap](#roadmap)
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
npm install @bybit-exchange/api
# or
yarn add @bybit-exchange/api
# or
pnpm add @bybit-exchange/api
```

## Quick Start

```ts
import { BybitClient } from '@bybit-exchange/api'

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
  category:  'linear',
  symbol:    'BTCUSDT',
  side:      'Buy',
  orderType: 'Limit',
  qty:       '0.01',
  price:     '30000',
  timeInForce: 'GTC',
})
console.log('orderId:', order.result.orderId)
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

## Testnet

Toggle via the `testnet` flag:

```ts
const client = new BybitClient({
  apiKey:    process.env.BYBIT_TESTNET_KEY,
  apiSecret: process.env.BYBIT_TESTNET_SECRET,
  testnet:   true,
})
```

Get testnet API credentials from [https://testnet.bybit.com](https://testnet.bybit.com).

## Authentication

Signed endpoints use Bybit's V5 HMAC-SHA256 header signing scheme. The SDK builds and attaches these headers automatically when `signed: true` on a request:

- `X-BAPI-API-KEY`
- `X-BAPI-TIMESTAMP`
- `X-BAPI-RECV-WINDOW`
- `X-BAPI-SIGN` — `HMAC_SHA256(apiSecret, timestamp + apiKey + recvWindow + payload)`
- `X-BAPI-SIGN-TYPE` — `2` (HMAC-SHA256)

If you invoke a signed endpoint without `apiKey` / `apiSecret`, the SDK throws before making the network call.

Public endpoints under `/v5/market/*` are called with no auth headers.

## Services

Each API group is a property on `BybitClient`:

```ts
client.market        // MarketService        — public market data (kline, tickers, orderbook, ...)
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

Most services accept and emit `camelCase` fields end-to-end. A subset of bot-family services (`grid`, `futures-grid`, `futures-combo`, `futures-martingale`, `dca`, `combo`) require `snake_case` on the wire — the SDK preserves the wire representation in those params so the request maps 1:1 with the Bybit docs. Follow the type hints for each method.

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
} from '@bybit-exchange/api'

try {
  await client.trade.createOrder({ /* ... */ })
} catch (err) {
  if (err instanceof BybitAuthError) {
    // 10003/10004/10005/10007/10008/10009/10010/10029 or HTTP 401/403.
    // Rotate keys, re-authenticate — do NOT retry blindly.
    return rotateKeys()
  }
  if (err instanceof BybitRateLimitError) {
    // retCodes 10006/10018 or HTTP 429/CF-blocked 403.
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

## Rate Limit Info

Bybit V5 returns rate-limit budget headers (`X-Bapi-Limit`, `X-Bapi-Limit-Status`, `X-Bapi-Limit-Reset-Timestamp`) on successful responses. The SDK attaches them non-enumerably to the response body so JSON serialization stays unchanged:

```ts
import { getRateLimit } from '@bybit-exchange/api'

const positions = await client.position.getPositionInfo({ category: 'linear' })
const limit = getRateLimit(positions)
if (limit && Number(limit.remaining) < 10) {
  // slow down
}
```

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

High-value endpoints ship narrow `Result` interfaces (`WalletBalanceResult`, `CreateOrderResult`, `TickersResult`, `KlineResult`, `PositionInfoResult`, `OpenOrdersResult`); other endpoints return `ApiResponse<unknown>` for now.

## TypeScript

The package is authored in TypeScript and ships pre-built `.js` + `.d.ts` files with dual CJS / ESM entrypoints and an `exports` map.

```ts
import type { RestClientOptions, ApiResponse, Category, Side } from '@bybit-exchange/api'
```

Every endpoint method's params are typed. Enumerated fields (`category`, `side`, `orderType`, `timeInForce`, `orderStatus`, `accountType`) use `Category | Side | OrderType | TimeInForce | OrderStatus | AccountType` unions with a `(string & {})` escape hatch — future values won't need a bump.

## Custom Axios Instance

Bring your own `AxiosInstance` when you need interceptors, retries, proxies, or shared connection pooling:

```ts
import axios from 'axios'
import { BybitClient } from '@bybit-exchange/api'

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
- **WebSocket streams.** Only REST is supported today. Public and private WebSocket streams are planned as a separate module.
- **Automatic retry / backoff.** Users needing this today should wrap their own axios instance with a retry interceptor.
- **Broader test coverage.** REST wire-shape smoke tests per service are in progress.
- **Examples.** More end-to-end scripts under `examples/`.

Contributions in any of these areas are welcome.

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
```

The service files under `src/rest-api/*.ts` are code-generated from the Bybit OpenAPI spec by an internal workflow. Hand-editing is fine for one-off fixes but note that the generator will replace naming / structure changes on the next regeneration run. Prefer PRs that improve:
- The hand-maintained plumbing (`src/http/*`, `src/config.ts`, `src/client.ts`, `src/index.ts`, `src/types/common.ts`)
- Response DTOs under `src/types/`
- Examples, tests, docs

## License

MIT — see [LICENSE](LICENSE).
