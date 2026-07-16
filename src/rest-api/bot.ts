import type { AxiosInstance } from 'axios'
import { requestJson } from '../http/request.js'
import type { ApiResponse } from '../types/common.js'
import type { BotSymbolSetting } from '../types/nested.js'
import type { RestClientOptions } from '../config.js'

// Bot subsystems (grid / futures-grid / futures-combo / futures-martingale / dca) require
// snake_case on the wire. The SDK accepts camelCase params and translates them at the request
// boundary — call sites stay consistent with the rest of the SDK.

export class BotService {
  constructor(
    protected readonly http: AxiosInstance,
    protected readonly opts: RestClientOptions,
  ) {}

  /**
   * Close a running futures grid bot by bot ID.
   */
  async closeFuturesGridBot(params: {
    botId: number
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/fgridbot/close',
      signed: true,
      body: {
        bot_id: params.botId,
      },
    })
  }

  /**
   * Create a new futures grid trading bot with specified parameters.
   */
  async createFuturesGridBot(params: {
    symbol:                   string
    gridMode:                 number
    minPrice:                 string
    maxPrice:                 string
    cellNumber:               number
    leverage:                 string
    gridType:                 number
    totalInvestment:          string
    takeProfitPer?:           string
    stopLossPer?:             string
    entryPrice?:              string
    source?:                  number
    followedGridId?:          number
    toolsDiscoveryParameter?: Record<string, unknown>
    stopLossPrice?:           string
    takeProfitPrice?:         string
    tpSlType?:                number
    blockSource?:             number
    createType?:              number
    initBonus?:               string
    businessRemark?:          string
    trailingStopPer?:         string
    moveUpPrice?:             string
    moveDownPrice?:           string
    channel?:                 string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/fgridbot/create',
      signed: true,
      body: {
        symbol:                    params.symbol,
        grid_mode:                 params.gridMode,
        min_price:                 params.minPrice,
        max_price:                 params.maxPrice,
        cell_number:               params.cellNumber,
        leverage:                  params.leverage,
        grid_type:                 params.gridType,
        total_investment:          params.totalInvestment,
        take_profit_per:           params.takeProfitPer,
        stop_loss_per:             params.stopLossPer,
        entry_price:               params.entryPrice,
        source:                    params.source,
        followed_grid_id:          params.followedGridId,
        tools_discovery_parameter: params.toolsDiscoveryParameter,
        stop_loss_price:           params.stopLossPrice,
        take_profit_price:         params.takeProfitPrice,
        tp_sl_type:                params.tpSlType,
        block_source:              params.blockSource,
        create_type:               params.createType,
        init_bonus:                params.initBonus,
        business_remark:           params.businessRemark,
        trailing_stop_per:         params.trailingStopPer,
        move_up_price:             params.moveUpPrice,
        move_down_price:           params.moveDownPrice,
        channel:                   params.channel,
      },
    })
  }

  /**
   * Get full details of a futures grid bot including PnL, positions, and status.
   */
  async getFuturesGridDetail(params: {
    botId: number
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/fgridbot/detail',
      signed: true,
      body: {
        bot_id: params.botId,
      },
    })
  }

  /**
   * Validate futures grid bot input parameters and return allowable ranges.
   */
  async validateFuturesGridInput(params: {
    symbol:            string
    cellNumber:        number
    minPrice:          string
    maxPrice:          string
    leverage:          string
    gridType:          number
    gridMode:          number
    stopLossPrice?:    string
    takeProfitPrice?:  string
    tpSlType?:         number
    entryPrice?:       string
    stopLossPer?:      string
    takeProfitPer?:    string
    trailingStopPer?:  string
    initMargin?:       string
    moveUpPrice?:      string
    moveDownPrice?:    string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/fgridbot/validate',
      signed: true,
      body: {
        symbol:            params.symbol,
        cell_number:       params.cellNumber,
        min_price:         params.minPrice,
        max_price:         params.maxPrice,
        leverage:          params.leverage,
        grid_type:         params.gridType,
        grid_mode:         params.gridMode,
        stop_loss_price:   params.stopLossPrice,
        take_profit_price: params.takeProfitPrice,
        tp_sl_type:        params.tpSlType,
        entry_price:       params.entryPrice,
        stop_loss_per:     params.stopLossPer,
        take_profit_per:   params.takeProfitPer,
        trailing_stop_per: params.trailingStopPer,
        init_margin:       params.initMargin,
        move_up_price:     params.moveUpPrice,
        move_down_price:   params.moveDownPrice,
      },
    })
  }

  /**
   * Close a running DCA bot with a specified settlement mode.
   */
  async closeDcaBot(params: {
    botId:     number
    closeMode: number
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/dca/close-bot',
      signed: true,
      body: {
        bot_id:     params.botId,
        close_mode: params.closeMode,
      },
    })
  }

  /**
   * Create a new DCA (Dollar-Cost Averaging) bot with custom parameters.
   */
  async createDcaBot(params: {
    parameters:               Record<string, unknown>
    toolsDiscoveryParameter?: Record<string, unknown>
    channel?:                 string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/dca/create-bot',
      signed: true,
      body: {
        parameters:                params.parameters,
        tools_discovery_parameter: params.toolsDiscoveryParameter,
        channel:                   params.channel,
      },
    })
  }

  /**
   * Close a running futures combo bot by bot ID.
   */
  async closeComboBot(params: {
    botId:     number
    stopType?: number
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/fcombobot/close',
      signed: true,
      body: {
        bot_id:    params.botId,
        stop_type: params.stopType,
      },
    })
  }

  /**
   * Create a new futures combo bot with multi-symbol portfolio and rebalancing.
   */
  async createComboBot(params: {
    leverage:                   string
    initMargin:                 string
    adjustPositionMode:         number
    symbolSettings:             BotSymbolSetting[]
    adjustPositionPercent?:     string
    adjustPositionTimeInterval?: number
    slPercent?:                 string
    tpPercent?:                 string
    source?:                    number
    blockSource?:               number
    createType?:                number
    followedBotId?:             number
    initBonus?:                 string
    trailingStopPercent?:       string
    channel?:                   string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/fcombobot/create',
      signed: true,
      body: {
        leverage:                      params.leverage,
        init_margin:                   params.initMargin,
        adjust_position_mode:          params.adjustPositionMode,
        symbol_settings:               params.symbolSettings,
        adjust_position_percent:       params.adjustPositionPercent,
        adjust_position_time_interval: params.adjustPositionTimeInterval,
        sl_percent:                    params.slPercent,
        tp_percent:                    params.tpPercent,
        source:                        params.source,
        block_source:                  params.blockSource,
        create_type:                   params.createType,
        followed_bot_id:               params.followedBotId,
        init_bonus:                    params.initBonus,
        trailing_stop_percent:         params.trailingStopPercent,
        channel:                       params.channel,
      },
    })
  }

  /**
   * Get full details of a futures combo bot including PnL, positions, and status.
   */
  async getComboDetail(params: {
    botId: number
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/fcombobot/detail',
      signed: true,
      body: {
        bot_id: params.botId,
      },
    })
  }

  /**
   * Validate combo bot input parameters and return allowable ranges.
   */
  async getComboLimit(params: {
    leverage:                    string
    initMargin:                  string
    adjustPositionMode:          number
    symbolSettings:              BotSymbolSetting[]
    adjustPositionPercent?:      string
    adjustPositionTimeInterval?: number
    slPercent?:                  string
    tpPercent?:                  string
    needToSlippage?:             boolean
    appName?:                    string
    trailingStopPercent?:        string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/fcombobot/getlimit',
      signed: true,
      body: {
        leverage:                      params.leverage,
        init_margin:                   params.initMargin,
        adjust_position_mode:          params.adjustPositionMode,
        symbol_settings:               params.symbolSettings,
        adjust_position_percent:       params.adjustPositionPercent,
        adjust_position_time_interval: params.adjustPositionTimeInterval,
        sl_percent:                    params.slPercent,
        tp_percent:                    params.tpPercent,
        need_to_slippage:              params.needToSlippage,
        app_name:                      params.appName,
        trailing_stop_percent:         params.trailingStopPercent,
      },
    })
  }

  /**
   * Close a running futures Martingale bot by bot ID.
   */
  async closeFuturesMartingaleBot(params: {
    botId:     number
    stopType?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/fmartingalebot/close',
      signed: true,
      body: {
        bot_id:    params.botId,
        stop_type: params.stopType,
      },
    })
  }

  /**
   * Create a new futures Martingale bot with DCA averaging strategy.
   */
  async createFuturesMartingaleBot(params: {
    symbol:              string
    martingaleMode:      string
    leverage:            string
    priceFloatPercent:   string
    addPositionPercent:  string
    addPositionNum:      number
    initMargin:          string
    roundTpPercent:      string
    autoCycleToggle?:    string
    slPercent?:          string
    entryPrice?:         string
    source?:             string
    followedBotId?:      number
    blockSource?:        string
    createType?:         string
    initBonus?:          string
    channel?:            string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/fmartingalebot/create',
      signed: true,
      body: {
        symbol:               params.symbol,
        martingale_mode:      params.martingaleMode,
        leverage:             params.leverage,
        price_float_percent:  params.priceFloatPercent,
        add_position_percent: params.addPositionPercent,
        add_position_num:     params.addPositionNum,
        init_margin:          params.initMargin,
        round_tp_percent:     params.roundTpPercent,
        auto_cycle_toggle:    params.autoCycleToggle,
        sl_percent:           params.slPercent,
        entry_price:          params.entryPrice,
        source:               params.source,
        followed_bot_id:      params.followedBotId,
        block_source:         params.blockSource,
        create_type:          params.createType,
        init_bonus:           params.initBonus,
        channel:              params.channel,
      },
    })
  }

  /**
   * Get full details of a futures Martingale bot including PnL, positions, and round progress.
   */
  async getFuturesMartingaleDetail(params: {
    botId: number
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/fmartingalebot/detail',
      signed: true,
      body: {
        bot_id: params.botId,
      },
    })
  }

  /**
   * Validate Martingale bot input parameters and return allowable ranges.
   */
  async getFuturesMartingaleLimit(params: {
    symbol:              string
    martingaleMode:      string
    leverage:            string
    priceFloatPercent?:  string
    addPositionPercent?: string
    addPositionNum?:     number
    initMargin?:         string
    roundTpPercent?:     string
    slPercent?:          string
    entryPrice?:         string
    needToSlippage?:     boolean
    appName?:            string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/fmartingalebot/getlimit',
      signed: true,
      body: {
        symbol:               params.symbol,
        martingale_mode:      params.martingaleMode,
        leverage:             params.leverage,
        price_float_percent:  params.priceFloatPercent,
        add_position_percent: params.addPositionPercent,
        add_position_num:     params.addPositionNum,
        init_margin:          params.initMargin,
        round_tp_percent:     params.roundTpPercent,
        sl_percent:           params.slPercent,
        entry_price:          params.entryPrice,
        need_to_slippage:     params.needToSlippage,
        app_name:             params.appName,
      },
    })
  }

  /**
   * Close a running spot grid bot with a specified settlement mode.
   */
  async closeGridBot(params: {
    gridId:    number
    closeMode: number
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/grid/close-grid',
      signed: true,
      body: {
        grid_id:    params.gridId,
        close_mode: params.closeMode,
      },
    })
  }

  /**
   * Create a new spot grid trading bot.
   */
  async createGridBot(params: {
    symbol:                   string
    maxPrice:                 string
    minPrice:                 string
    totalInvestment:          string
    cellNumber:               number
    followedGridId?:          number
    source?:                  number
    entryPrice?:              string
    stopLossPrice?:           string
    takeProfitPrice?:         string
    toolsDiscoveryParameter?: Record<string, unknown>
    baseInvestment?:          string
    quoteInvestment?:         string
    investMode?:              number
    blockSource?:             number
    createType?:              number
    tsPercent?:               string
    enableTrailing?:          boolean
    limitUpPrice?:            string
    channel?:                 string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/grid/create-grid',
      signed: true,
      body: {
        symbol:                    params.symbol,
        max_price:                 params.maxPrice,
        min_price:                 params.minPrice,
        total_investment:          params.totalInvestment,
        cell_number:               params.cellNumber,
        followed_grid_id:          params.followedGridId,
        source:                    params.source,
        entry_price:               params.entryPrice,
        stop_loss_price:           params.stopLossPrice,
        take_profit_price:         params.takeProfitPrice,
        tools_discovery_parameter: params.toolsDiscoveryParameter,
        base_investment:           params.baseInvestment,
        quote_investment:          params.quoteInvestment,
        invest_mode:               params.investMode,
        block_source:              params.blockSource,
        create_type:               params.createType,
        ts_percent:                params.tsPercent,
        enable_trailing:           params.enableTrailing,
        limit_up_price:            params.limitUpPrice,
        channel:                   params.channel,
      },
    })
  }

  /**
   * Query full details of a specific grid bot by grid ID.
   */
  async getGridDetail(params: {
    gridId: number
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/grid/query-grid-detail',
      signed: true,
      body: {
        grid_id: params.gridId,
      },
    })
  }

  /**
   * Validate spot grid bot parameters before creation.
   */
  async validateGridInput(params: {
    symbol:           string
    cellNumber:       number
    minPrice:         string
    maxPrice:         string
    totalInvestment:  string
    stopLoss?:        string
    takeProfit?:      string
    entryPrice?:      string
    baseInvestment?:  string
    quoteInvestment?: string
    investMode?:      number
    tsPercent?:       string
    enableTrailing?:  boolean
    limitUpPrice?:    string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/grid/validate-input',
      signed: true,
      body: {
        symbol:           params.symbol,
        cell_number:      params.cellNumber,
        min_price:        params.minPrice,
        max_price:        params.maxPrice,
        total_investment: params.totalInvestment,
        stop_loss:        params.stopLoss,
        take_profit:      params.takeProfit,
        entry_price:      params.entryPrice,
        base_investment:  params.baseInvestment,
        quote_investment: params.quoteInvestment,
        invest_mode:      params.investMode,
        ts_percent:       params.tsPercent,
        enable_trailing:  params.enableTrailing,
        limit_up_price:   params.limitUpPrice,
      },
    })
  }
}
