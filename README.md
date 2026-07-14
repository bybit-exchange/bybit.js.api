# bybit-connector-js

Official lightweight TypeScript / JavaScript connector for the [Bybit V5 REST API](https://bybit-exchange.github.io/docs/v5/intro).

`bybit-connector-js` is a thin, typed wrapper around the Bybit V5 HTTP endpoints. It ships as a single npm package with one service class per API group (`market`, `trade`, `account`, `position`, `asset`, `user`, `affiliate`, `broker`, `lending`, `crypto-loan`, `rfq`, `spread-trade`, `spot-margin`, `earn`, `p2p`, `alpha`, `bot`). Its goal is the same as [`pybit`](https://github.com/bybit-exchange/pybit) on the Python side: an easy-to-use, high-performance connector with a small dependency footprint.

The client currently exposes **~250 REST endpoints** across **15 service modules**, all reachable from a single `BybitClient`.

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
- [Response Shape](#response-shape)
- [TypeScript](#typescript)
- [Custom Axios Instance](#custom-axios-instance)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## About

Bybit maintains four first-party SDKs today: [`bybit-java-api`](https://github.com/bybit-exchange/bybit-java-api), [`bybit.net.api`](https://github.com/bybit-exchange/bybit.net.api), [`bybit.go.api`](https://github.com/bybit-exchange/bybit.go.api), [`pybit`](https://github.com/bybit-exchange/pybit), [`bybit-rust-api`](https://github.com/bybit-exchange/bybit-rust-api), and this repo — the TypeScript / JavaScript connector.

Design choices:

- **TypeScript-first.** Every endpoint is a typed `async` method returning `Promise<ApiResponse<unknown>>`. Consumers get full autocomplete on request parameters. Response DTOs are opt-in and hand-added (see [Roadmap](#roadmap)).
- **Params object, always.** Every endpoint takes a single `params` object argument — no positional parameters. This makes call sites self-documenting and forward-compatible when new optional params land.
- **One dependency**: `axios`. Users who prefer another HTTP stack can pass their own `AxiosInstance`; the SDK will not create one.
- **Wire-key correctness**: services that use snake_case on the wire (DCA / grid / futures-combo / futures-grid / futures-martingale) get keys translated automatically. You always call the API with camelCase in your params; the SDK sends what the server expects.

## Installation

Node 18 or higher is required.

```bash
npm install bybit-connector-js
# or
yarn add bybit-connector-js
# or
pnpm add bybit-connector-js
```

## Quick Start

```ts
import { BybitClient } from 'bybit-connector-js'

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
| `apiSecret` | `string` | — | API secret used for HMAC-SHA256 signing. Required for signed endpoints. |
| `testnet` | `boolean` | `false` | If `true`, uses `https://api-testnet.bybit.com`. Ignored when `baseUrl` is set. |
| `baseUrl` | `string` | see below | Full base URL override (e.g. for a self-hosted proxy). Wins over `testnet`. |
| `recvWindow` | `string` | `'5000'` | `X-BAPI-RECV-WINDOW` header value, in ms. Increase if you see `10002` errors due to client-clock skew. |
| `timeout` | `number` | `10000` | Per-request timeout, ms. Passed to axios. |
| `axiosInstance` | `AxiosInstance` | — | Bring your own axios instance — interceptors, agents, retries, whatever you need. When supplied, `baseUrl` / `timeout` are ignored (configure them on your instance). |

Default base URLs:
- Mainnet: `https://api.bybit.com`
- Testnet: `https://api-testnet.bybit.com`

Exported constants: `BASE_URL_MAINNET`, `BASE_URL_TESTNET`.

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

If you invoke a signed endpoint without `apiKey` / `apiSecret`, the SDK throws before making the network call.

Public endpoints under `/v5/market/*` are called with no auth headers.

## Services

Each API group is a property on `BybitClient`:

```ts
client.market        // MarketService        — public market data (kline, tickers, orderbook, ...)
client.trade         // TradeService         — orders (create / amend / cancel / batch / history)
client.position      // PositionService      — positions, leverage, TP/SL, move-position
client.account       // AccountService       — wallet, margin, collateral, fee-rate, transfer log
client.asset         // AssetService         — funding, coin info, greeks
client.user          // UserService          — sub-accounts, API-key management
client.affiliate     // AffiliateService     — sub-affiliate lists
client.broker        // BrokerService        — broker earnings, distributions, rate limits
client.lending       // LendingService       — institutional loan
client.cryptoLoan    // CryptoLoanService    — flexible / fixed crypto loans
client.rfq           // RfqService           — request-for-quote (block trades)
client.spreadTrade   // SpreadTradingService — spread trading (planned)
client.spotMargin    // SpotMarginService    — UTA spot margin
client.earn          // EarnService          — earn, liquidity mining, RWA, PWM, hold-to-earn
client.rateLimit     // RateLimitService     — v5/apilimit/*
client.p2p           // P2pService           — P2P advertise / order / chat
client.alpha         // AlphaService         — v5/alpha trade endpoints
client.bot           // BotService           — DCA / grid / futures-combo / futures-grid / martingale
```

## Error Handling

When the server returns `retCode !== 0`, the SDK throws a `BybitApiError`:

```ts
import { BybitClient, BybitApiError } from 'bybit-connector-js'

try {
  await client.trade.createOrder({ /* ... */ })
} catch (err) {
  if (err instanceof BybitApiError) {
    console.error('Bybit rejected the request:', err.retCode, err.retMsg)
    console.error('server time:', err.time)
    console.error('partial result:', err.result)
  } else {
    // network / timeout / DNS / TLS — thrown by axios
    throw err
  }
}
```

`BybitApiError` fields:

| Field | Type | Description |
|---|---|---|
| `retCode` | `number` | Bybit error code (e.g. `10001`) |
| `retMsg`  | `string` | Human-readable message |
| `time`    | `number` | Server timestamp when the error was produced |
| `result`  | `unknown` | Partial `result` payload, if any |

See the [Bybit V5 error code list](https://bybit-exchange.github.io/docs/v5/error) for meanings.

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

For now `T` is `unknown` — you narrow it yourself. Typed responses are planned; see [Roadmap](#roadmap).

## TypeScript

The package is authored in TypeScript and ships pre-built `.js` + `.d.ts` files.

```ts
import type { RestClientOptions, ApiResponse } from 'bybit-connector-js'
```

Type-only re-exports also flow through the main entry so tree-shaking is preserved.

Every endpoint method's params are typed, e.g.:

```ts
client.market.getKline(params: {
  category: string
  symbol:   string
  interval: string
  start?:   number
  end?:     number
  limit?:   number
}): Promise<ApiResponse<unknown>>
```

## Custom Axios Instance

Bring your own `AxiosInstance` when you need interceptors, retries, proxies, or shared connection pooling:

```ts
import axios from 'axios'
import { BybitClient } from 'bybit-connector-js'

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

When `axiosInstance` is supplied, `baseUrl` / `testnet` / `timeout` on `RestClientOptions` are ignored — configure everything on your axios instance.

## Roadmap

Known gaps, ordered by priority:

- **Typed response DTOs.** Every method currently returns `ApiResponse<unknown>`. High-value endpoints (`getKline`, `getTickers`, `getWalletBalance`, `createOrder`) will get typed `Result` interfaces first, then the rest follows.
- **WebSocket streams.** Only REST is supported today. Public and private WebSocket streams (order updates, wallet updates, mark-price stream) are planned as a separate module.
- **Retry / rate-limit awareness.** Users needing this today should wrap their own axios instance with a retry interceptor.
- **Examples.** More end-to-end scripts under `examples/`.
- **Unit tests.** Currently the connector relies on Bybit V5 spec-compat + `tsc` type checking. Parameter serialization + signature-payload tests are on the way.

Contributions in any of these areas are welcome.

## Contributing

Bug reports and feature requests: [GitHub Issues](https://github.com/bybit-exchange/bybit.js.api/issues).

Local development:

```bash
git clone https://github.com/bybit-exchange/bybit.js.api.git
cd bybit.js.api
npm install
npm run build      # tsc
npm run lint       # eslint
npm run format     # prettier
npm test           # jest (once tests land)
```

The service files under `src/rest-api/*.ts` are code-generated from the Bybit OpenAPI spec by an internal workflow. Hand-editing is fine for one-off fixes but note that the generator will replace naming / structure changes on the next regeneration run. Prefer PRs that improve:
- The hand-maintained plumbing (`src/http/*`, `src/config.ts`, `src/client.ts`, `src/index.ts`, `src/types/common.ts`)
- Response DTOs under `src/types/`
- Examples, tests, docs

## License

MIT — see [LICENSE](LICENSE).
