import type { AxiosInstance } from 'axios'
import { requestJson } from '../http/request'
import type { ApiResponse } from '../types/common'
import type { RestClientOptions } from '../config'

export class MarketService {
  constructor(
    protected readonly http: AxiosInstance,
    protected readonly opts: RestClientOptions,
  ) {}

  /**
   * Get ADL Alert information for a given symbol.
   * @see https://bybit-exchange.github.io/docs/v5/market/adl-alert
   */
  async getAdlAlert(params?: {
    symbol?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/market/adlAlert',
      signed: false,
      query: {
        symbol: params?.symbol,
      },
    })
  }

  /**
   * Get the delivery price for delivery contracts.
   * @see https://bybit-exchange.github.io/docs/v5/market/delivery-price
   */
  async getDeliveryPrice(params: {
    category:     string
    symbol?:      string
    baseCoin?:    string
    settleCoin?:  string
    limit?:       number
    cursor?:      string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/market/delivery-price',
      signed: false,
      query: {
        category:   params.category,
        symbol:     params.symbol,
        baseCoin:   params.baseCoin,
        settleCoin: params.settleCoin,
        limit:      params.limit,
        cursor:     params.cursor,
      },
    })
  }

  /**
   * Get the fee group structure.
   * @see https://bybit-exchange.github.io/docs/v5/market/fee-group-info
   */
  async getFeeGroupInfo(params: {
    productType: string
    groupId?:    string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/market/fee-group-info',
      signed: false,
      query: {
        productType: params.productType,
        groupId:     params.groupId,
      },
    })
  }

  /**
   * Get historical funding rates for a symbol.
   * @see https://bybit-exchange.github.io/docs/v5/market/history-fund-rate
   */
  async getFundingRateHistory(params: {
    category:   string
    symbol:     string
    startTime?: number
    endTime?:   number
    limit?:     number
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/market/funding/history',
      signed: false,
      query: {
        category:  params.category,
        symbol:    params.symbol,
        startTime: params.startTime,
        endTime:   params.endTime,
        limit:     params.limit,
      },
    })
  }

  /**
   * Get historical volatility data for options.
   * @see https://bybit-exchange.github.io/docs/v5/market/iv
   */
  async getHistoricalVolatility(params: {
    category:    string
    baseCoin?:   string
    quoteCoin?:  string
    period?:     number
    startTime?:  number
    endTime?:    number
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/market/historical-volatility',
      signed: false,
      query: {
        category:  params.category,
        baseCoin:  params.baseCoin,
        quoteCoin: params.quoteCoin,
        period:    params.period,
        startTime: params.startTime,
        endTime:   params.endTime,
      },
    })
  }

  /**
   * Get the constituents used to compute a spot index price.
   */
  async getIndexPriceComponents(params: {
    indexName: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/market/index-price-components',
      signed: false,
      query: {
        indexName: params.indexName,
      },
    })
  }

  /**
   * Get index price kline (candlestick) data.
   * @see https://bybit-exchange.github.io/docs/v5/market/index-kline
   */
  async getIndexPriceKline(params: {
    symbol:    string
    interval:  string
    category?: string
    start?:    number
    end?:      number
    limit?:    number
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/market/index-price-kline',
      signed: false,
      query: {
        symbol:   params.symbol,
        interval: params.interval,
        category: params.category,
        start:    params.start,
        end:      params.end,
        limit:    params.limit,
      },
    })
  }

  /**
   * Get specifications for online trading pairs.
   * @see https://bybit-exchange.github.io/docs/v5/market/instrument
   */
  async getInstrumentsInfo(params: {
    category:  string
    symbol?:   string
    status?:   string
    baseCoin?: string
    limit?:    number
    cursor?:   string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/market/instruments-info',
      signed: false,
      query: {
        category: params.category,
        symbol:   params.symbol,
        status:   params.status,
        baseCoin: params.baseCoin,
        limit:    params.limit,
        cursor:   params.cursor,
      },
    })
  }

  /**
   * Get insurance pool data.
   * @see https://bybit-exchange.github.io/docs/v5/market/insurance
   */
  async getInsurancePool(params?: {
    coin?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/market/insurance',
      signed: false,
      query: {
        coin: params?.coin,
      },
    })
  }

  /**
   * Get the long-short ratio of accounts for a symbol.
   * @see https://bybit-exchange.github.io/docs/v5/market/long-short-ratio
   */
  async getLongShortRatio(params: {
    category:   string
    symbol:     string
    period:     string
    startTime?: string
    endTime?:   string
    limit?:     number
    cursor?:    string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/market/account-ratio',
      signed: false,
      query: {
        category:  params.category,
        symbol:    params.symbol,
        period:    params.period,
        startTime: params.startTime,
        endTime:   params.endTime,
        limit:     params.limit,
        cursor:    params.cursor,
      },
    })
  }

  /**
   * Get kline (candlestick) data for a symbol.
   * @see https://bybit-exchange.github.io/docs/v5/market/kline
   */
  async getMarketKline(params: {
    symbol:    string
    interval:  string
    category?: string
    start?:    number
    end?:      number
    limit?:    number
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/market/kline',
      signed: false,
      query: {
        symbol:   params.symbol,
        interval: params.interval,
        category: params.category,
        start:    params.start,
        end:      params.end,
        limit:    params.limit,
      },
    })
  }

  /**
   * Get mark price kline (candlestick) data.
   * @see https://bybit-exchange.github.io/docs/v5/market/mark-kline
   */
  async getMarkPriceKline(params: {
    symbol:    string
    interval:  string
    category?: string
    start?:    number
    end?:      number
    limit?:    number
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/market/mark-price-kline',
      signed: false,
      query: {
        symbol:   params.symbol,
        interval: params.interval,
        category: params.category,
        start:    params.start,
        end:      params.end,
        limit:    params.limit,
      },
    })
  }

  /**
   * Get the new delivery price for delivery contracts.
   * @see https://bybit-exchange.github.io/docs/v5/market/new-delivery-price
   */
  async getNewDeliveryPrice(params: {
    category:    string
    baseCoin:    string
    settleCoin?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/market/new-delivery-price',
      signed: false,
      query: {
        category:   params.category,
        baseCoin:   params.baseCoin,
        settleCoin: params.settleCoin,
      },
    })
  }

  /**
   * Get open interest data for a symbol.
   * @see https://bybit-exchange.github.io/docs/v5/market/open-interest
   */
  async getOpenInterest(params: {
    category:     string
    symbol:       string
    intervalTime: string
    startTime?:   number
    endTime?:     number
    limit?:       number
    cursor?:      string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/market/open-interest',
      signed: false,
      query: {
        category:     params.category,
        symbol:       params.symbol,
        intervalTime: params.intervalTime,
        startTime:    params.startTime,
        endTime:      params.endTime,
        limit:        params.limit,
        cursor:       params.cursor,
      },
    })
  }

  /**
   * Get Orderbook
   * @see https://bybit-exchange.github.io/docs/v5/market/orderbook
   */
  async getOrderbook(params: {
    category: string
    symbol:   string
    limit?:   number
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/market/orderbook',
      signed: false,
      query: {
        category: params.category,
        symbol:   params.symbol,
        limit:    params.limit,
      },
    })
  }

  /**
   * Get the order price limit for a symbol.
   */
  async getOrderPriceLimit(params: {
    symbol:    string
    category?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/market/price-limit',
      signed: false,
      query: {
        symbol:   params.symbol,
        category: params.category,
      },
    })
  }

  /**
   * Get Premium Index Price Kline
   * @see https://bybit-exchange.github.io/docs/v5/market/premium-index-kline
   */
  async getPremiumIndexPriceKline(params: {
    symbol:    string
    interval:  string
    category?: string
    start?:    number
    end?:      number
    limit?:    number
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/market/premium-index-price-kline',
      signed: false,
      query: {
        symbol:   params.symbol,
        interval: params.interval,
        category: params.category,
        start:    params.start,
        end:      params.end,
        limit:    params.limit,
      },
    })
  }

  /**
   * Get Recent Public Trades
   * @see https://bybit-exchange.github.io/docs/v5/market/recent-trade
   */
  async getRecentPublicTrades(params: {
    category:    string
    symbol?:     string
    baseCoin?:   string
    optionType?: string
    limit?:      number
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/market/recent-trade',
      signed: false,
      query: {
        category:   params.category,
        symbol:     params.symbol,
        baseCoin:   params.baseCoin,
        optionType: params.optionType,
        limit:      params.limit,
      },
    })
  }

  /**
   * Get Risk Limit
   * @see https://bybit-exchange.github.io/docs/v5/market/risk-limit
   */
  async getRiskLimit(params: {
    category: string
    symbol?:  string
    cursor?:  string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/market/risk-limit',
      signed: false,
      query: {
        category: params.category,
        symbol:   params.symbol,
        cursor:   params.cursor,
      },
    })
  }

  /**
   * Get RPI Orderbook
   * @see https://bybit-exchange.github.io/docs/v5/market/rpi-orderbook
   */
  async getRpiOrderbook(params: {
    symbol:    string
    limit:     number
    category?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/market/rpi-orderbook',
      signed: false,
      query: {
        symbol:   params.symbol,
        limit:    params.limit,
        category: params.category,
      },
    })
  }

  /**
   * Get Server Time
   * @see https://bybit-exchange.github.io/docs/v5/market/time
   */
  async getServerTime(): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/market/time',
      signed: false,
    })
  }

  /**
   * Get Tickers
   * @see https://bybit-exchange.github.io/docs/v5/market/tickers
   */
  async getTickers(params: {
    category:  string
    symbol?:   string
    baseCoin?: string
    expDate?:  string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/market/tickers',
      signed: false,
      query: {
        category: params.category,
        symbol:   params.symbol,
        baseCoin: params.baseCoin,
        expDate:  params.expDate,
      },
    })
  }
}
